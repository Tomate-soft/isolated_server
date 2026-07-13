import { Injectable } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { Branch } from 'src/schemas/business/branchSchema';
import {
  OperatingPeriod,
  CheckInRegister,
} from 'src/schemas/operatingPeriod/operatingPeriod.schema';
import { Table } from 'src/schemas/tables/tableSchema';
import { branchId } from 'src/variablesProvisionales';
import { PENDING_STATUS } from 'src/libs/status.libs';

@Injectable()
export class WaitlistRegister {
  constructor(
    @InjectModel(OperatingPeriod.name)
    private readonly operatingPeriodModel: Model<OperatingPeriod>,
    @InjectModel(Branch.name) private readonly branchModel: Model<Branch>,
    @InjectModel(Table.name) private readonly tableModel: Model<Table>,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  async approveWaitlistEntry(
    idempotencyKey: string,
    tableId: string,
    diners: number,
  ): Promise<{ registers: CheckInRegister[]; tables: Table[] }> {
    const session = await this.connection.startSession();
    try {
      let result: { registers: CheckInRegister[]; tables: Table[] };

      await session.withTransaction(async () => {
        const branch = await this.branchModel
          .findById(branchId)
          .select('operatingPeriod')
          .session(session);
        const periodId = branch.operatingPeriod;

        const response = await this.operatingPeriodModel
          .findById(periodId)
          .select('registers')
          .session(session)
          .lean();
        const registerIndex = response.registers.findIndex(
          (register) => register.idempotencyKey === idempotencyKey,
        );

        if (registerIndex === -1) {
          throw new Error('Registro no encontrado');
        }

        // Set status to 'complete'
        response.registers[registerIndex].status = 'complete';

        // Set finalTime to now (ISO string)
        const now = new Date();
        const nowIso = now.toISOString();
        response.registers[registerIndex].finalTime = nowIso;

        // Calculate difference in minutes between initialTime and finalTime
        const initialTime = response.registers[registerIndex].initialTime;
        let minutesDiff = null;
        if (initialTime) {
          try {
            const initial = new Date(initialTime);
            const diffMs = now.getTime() - initial.getTime();
            minutesDiff = Math.floor(diffMs / 60000);
          } catch (e) {
            minutesDiff = null;
          }
        }
        // Set resumeTime as the difference in minutes (string), or null if not calculable
        response.registers[registerIndex].resumeTime =
          minutesDiff !== null ? String(minutesDiff) : null;
        // response.registers[registerIndex].minutesDiff = minutesDiff;

        await this.operatingPeriodModel
          .findByIdAndUpdate(periodId, { registers: response.registers })
          .session(session);
        await this.tableModel
          .findByIdAndUpdate(tableId, { status: PENDING_STATUS, diners })
          .session(session);

        const tables = await this.tableModel.find({}).session(session).lean();
        result = { registers: response.registers, tables };
      });

      return result;
    } finally {
      session.endSession();
    }
  }

  async createWaitListRegister(register: CheckInRegister): Promise<CheckInRegister[]> {
    const branch = await this.branchModel.findById(branchId).select('operatingPeriod');
    const periodId = branch.operatingPeriod;

    const response = await this.operatingPeriodModel
      .findByIdAndUpdate(periodId, { $push: { registers: register } }, { new: true })
      .select('registers')
      .lean();

    return response.registers;
  }

  async deleteWaitListRegister(idempotencyKey: string): Promise<CheckInRegister[]> {
    const branch = await this.branchModel.findById(branchId).select('operatingPeriod');
    const periodId = branch.operatingPeriod;

    const response = await this.operatingPeriodModel
      .findByIdAndUpdate(periodId, { $pull: { registers: { idempotencyKey } } }, { new: true })
      .select('registers')
      .lean();

    return response.registers;
  }

  async updateWaitListRegister(
    idempotencyKey: string,
    register: Partial<CheckInRegister>,
  ): Promise<CheckInRegister[]> {
    const branch = await this.branchModel.findById(branchId).select('operatingPeriod');
    const periodId = branch.operatingPeriod;

    const setObj = {};
    for (const key of Object.keys(register)) {
      setObj[`registers.$.${key}`] = register[key];
    }

    const response = await this.operatingPeriodModel
      .findOneAndUpdate(
        { _id: periodId, 'registers.idempotencyKey': idempotencyKey },
        { $set: setObj },
        { new: true },
      )
      .select('registers')
      .lean();

    if (!response) {
      throw new Error('Registro no encontrado o no se pudo actualizar');
    }

    return response.registers;
  }
}

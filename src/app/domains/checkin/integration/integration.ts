import { Injectable } from '@nestjs/common';
import { DataRepository } from 'src/app/data/data.repository';
import { DataQuery } from 'src/app/data/data.query';
import { PENDING_STATUS } from 'src/libs/status.libs';
import { CheckInRegister } from 'src/schemas/operatingPeriod/operatingPeriod.schema';

@Injectable()
export class Integration {
  constructor(
    private readonly dataRepository: DataRepository,
    private readonly dataQuery: DataQuery,
  ) {}

  async getPeriodTableRegister() {
    const data = await this.dataRepository.readOperatingPeriodsRepository.getTablePeriodRegister();
    return data;
  }

  async addTableCheckinRegisters(checkinRegisters: CheckInRegister[]) {
    const data =
      await this.dataRepository.writeOperatingPeriodRepository.addTableCheckinRegisters(
        checkinRegisters,
      );
    return data;
  }

  async tableApertureCheckin(tableId: string, diners: number) {
    const response = await this.dataRepository.writeTablesRepository.tableCheckinAperture(tableId, {
      diners: diners,
      status: PENDING_STATUS,
    });
    return response;
  }

  async getWaitList() {
    const data = await this.dataRepository.readOperatingPeriodsRepository.getWaitListRegisters();
    return data;
  }

  async createWaitListRegister(register: CheckInRegister) {
    const data = await this.dataQuery.waitlistRegister.createWaitListRegister(register);
    return data;
  }

  async deleteWaitListRegister(idempotencyKey: string) {
    const data = await this.dataQuery.waitlistRegister.deleteWaitListRegister(idempotencyKey);
    return data;
  }

  async updateWaitListRegister(idempotencyKey: string, register: Partial<CheckInRegister>) {
    // Only pass keys that have values to prevent undefined overwrites if using plain objects
    // The query logic handles Object.keys so it should be fine.
    const data = await this.dataQuery.waitlistRegister.updateWaitListRegister(
      idempotencyKey,
      register,
    );
    return data;
  }

  async approveWaitlistEntry(idempotencyKey: string, tableId: string, diners: number) {
    const data = await this.dataQuery.waitlistRegister.approveWaitlistEntry(
      idempotencyKey,
      tableId,
      diners,
    );
    return data;
  }
}

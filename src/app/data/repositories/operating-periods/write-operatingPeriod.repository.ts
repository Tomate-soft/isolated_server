import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Branch } from 'src/schemas/business/branchSchema';
import { OperatingPeriod } from 'src/schemas/operatingPeriod/operatingPeriod.schema';
import { branchId } from 'src/variablesProvisionales';

@Injectable()
export class WriteOperatingPeriodRepository {
  constructor(
    @InjectModel(OperatingPeriod.name)
    private operatingPeriodModel: Model<OperatingPeriod>,
    @InjectModel(Branch.name)
    private branchModel: Model<Branch>,
  ) {}

  async addTableCheckinRegisters(incomingRegisters: any[]) {
    const branch = await this.branchModel.findById(branchId).select('operatingPeriod').lean();
    const periodId = branch.operatingPeriod;

    // 1. Limpiamos duplicados que el frontend haya mandado por error en el mismo array
    const uniqueIncoming = Array.from(
      new Map(incomingRegisters.map((item) => [item.idempotencyKey, item])).values(),
    );

    // 2. OBTENER ESTADO ACTUAL: Necesitamos saber qué hay en la DB para comparar
    const currentPeriod = await this.operatingPeriodModel.findById(periodId).lean();
    const dbRegisters = currentPeriod.registers || [];

    // 3. IDENTIFICAR ELIMINADOS:
    // Registros que están en la DB pero NO están en lo que mandó el usuario
    const incomingKeys = new Set(uniqueIncoming.map((r) => r.idempotencyKey));
    const keysToDelete = dbRegisters
      .filter((dbReg) => !incomingKeys.has(dbReg.idempotencyKey))
      .map((dbReg) => dbReg.idempotencyKey);

    // 4. EJECUTAR OPERACIONES

    // A. Eliminar los que ya no existen
    if (keysToDelete.length > 0) {
      await this.operatingPeriodModel.findByIdAndUpdate(periodId, {
        $pull: { registers: { idempotencyKey: { $in: keysToDelete } } },
      });
    }

    // B. Actualizar los existentes (BulkWrite)
    const updateOps = uniqueIncoming.map((reg) => ({
      updateOne: {
        filter: { _id: periodId, 'registers.idempotencyKey': reg.idempotencyKey },
        update: { $set: { 'registers.$': reg } },
      },
    }));
    if (updateOps.length > 0) await this.operatingPeriodModel.bulkWrite(updateOps);

    // C. Insertar los nuevos (los que no estaban en dbRegisters)
    const dbKeys = new Set(dbRegisters.map((r) => r.idempotencyKey));
    const newRegisters = uniqueIncoming.filter((r) => !dbKeys.has(r.idempotencyKey));

    if (newRegisters.length > 0) {
      return await this.operatingPeriodModel
        .findByIdAndUpdate(
          periodId,
          { $push: { registers: { $each: newRegisters } } },
          { new: true },
        )
        .lean();
    }

    return await this.operatingPeriodModel.findById(periodId).lean();
  }
}

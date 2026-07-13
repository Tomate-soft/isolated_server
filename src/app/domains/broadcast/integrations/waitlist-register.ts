import { Injectable } from '@nestjs/common';
import { DataQuery } from 'src/app/data/data.query';
import { CheckInRegister } from 'src/schemas/operatingPeriod/operatingPeriod.schema';
import { Table } from 'src/schemas/tables/tableSchema';

@Injectable()
export class WaitlistRegister {
  constructor(private readonly dataQuery: DataQuery) {}

  async approveWaitlistEntry(
    idempotencyKey: string,
    tableId: string,
    diners: number,
  ): Promise<{ registers: CheckInRegister[]; tables: Table[] }> {
    return this.dataQuery.waitlistRegister.approveWaitlistEntry(idempotencyKey, tableId, diners);
  }
}

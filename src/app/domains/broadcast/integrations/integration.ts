import { Injectable } from '@nestjs/common';
import { WaitlistRegister } from './waitlist-register';
import { CheckInRegister } from 'src/schemas/operatingPeriod/operatingPeriod.schema';
import { Table } from 'src/schemas/tables/tableSchema';
import { DataRepository } from 'src/app/data/data.repository';

@Injectable()
export class Integration {
  constructor(
    public readonly waitlistRegister: WaitlistRegister,
    public readonly dataRepository: DataRepository,
  ) {}

  async approveWaitlistEntry(
    idempotencyKey: string,
    tableId: string,
    diners: number,
  ): Promise<{ registers: CheckInRegister[]; tables: Table[] }> {
    return this.waitlistRegister.approveWaitlistEntry(idempotencyKey, tableId, diners);
  }

  async getTablesForCheckin() {
    const tables = await this.dataRepository.readTablesRepository.getAllTablesForCheckin();
    return tables.sort((a, b) => parseFloat(a.tableNum) - parseFloat(b.tableNum));
  }
}

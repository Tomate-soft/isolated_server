import { Injectable } from '@nestjs/common';
import { ChangeStatusService } from './change-status.service';
import { ChangeDinersService } from './change-diners.service';
import { LiberateTableService } from './liberate-table.service';
import { DisableTableService } from './disable-table.service';
import { ActiveTableService } from './active-table.service';
import { ToNextReleaseService } from './to-next-release.service';
import { GetAllTablesService } from './get-all-tables.service';
// force

@Injectable()
export class TablesManagementService {
  constructor(
    private changeDinersService: ChangeDinersService,
    private changeStatusService: ChangeStatusService,
    private readonly liberateTableService: LiberateTableService,
    private readonly disableTableService: DisableTableService,
    private readonly activeTableService: ActiveTableService,
    private readonly toNextRelease: ToNextReleaseService,
    private readonly getAllTablesService: GetAllTablesService,
  ) {}

  async changeDiners(id: string, body: any) {
    const response = await this.changeDinersService.changeDiners(id, body);
    return response;
  }

  async liberateTable(id: string) {
    const response = await this.liberateTableService.liberateTable(id);
    return response;
  }

  async disableTable(body: any) {
    const response = await this.disableTableService.disableTable(body);
    return response;
  }

  async enableTables(body: any) {
    const response = await this.activeTableService.enableTables(body);
    return response;
  }
  async getTablesForNextRelease() {
    const response = await this.toNextRelease.toNextRelease();
    return response;
  }

  async getAllTables() {
    const response = await this.getAllTablesService.getAllTables();
    return response;
  }

  // async changeStatus(id: string, body: any) {
  //     return await this.changeStatusService.
  // }
}

import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { TablesManagementService } from '../services/tables-management.service';

@Controller('tables-management')
export class TablesManagementController {
  constructor(private tablesManagementService: TablesManagementService) {}
  @Patch('change-diners/:id')
  async changeDiners(@Param('id') id: string, @Body() body: { diners: number }) {
    try {
      const response = await this.tablesManagementService.changeDiners(id, body);
      return response;
    } catch (error) {
      throw new InternalServerErrorException(`Error al cambiar el numero de comensales: ${error}`);
    }
  }

  @Patch('liberate-table/:id')
  async liberateTable(@Param('id') id: string) {
    try {
      const response = await this.tablesManagementService.liberateTable(id);
      return response;
    } catch (error) {
      throw new InternalServerErrorException(`Error al liberar la mesa: ${error}`);
    }
  }

  @Post('disable-table')
  async disableTable(@Body() body: any) {
    try {
      const response = await this.tablesManagementService.disableTable(body);
      return response;
    } catch (error) {
      throw new InternalServerErrorException(`Error al deshabilitar la mesa: ${error}`);
    }
  }

  @Post('enable-tables')
  async enableTables(@Body() body: any) {
    try {
      const response = await this.tablesManagementService.enableTables(body);
      return response;
    } catch (error) {
      throw new InternalServerErrorException(`Error al deshabilitar la mesa: ${error}`);
    }
  }

  @Get('next-release')
  async getTablesForNextRelease() {
    try {
      const response = await this.tablesManagementService.getTablesForNextRelease();
      return response;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al obtener las mesas para el próximo release: ${error}`,
      );
    }
  }

  @Get('all-tables')
  async getAllTables() {
    try {
      const response = await this.tablesManagementService.getAllTables();
      return response;
    } catch (error) {
      throw new InternalServerErrorException(`Error al obtener todas las mesas: ${error}`);
    }
  }

  // force

  // @Patch('change-status')
  // async changeStatus(@Param('id') id: string, @Param('body') body: { status: string }) {
  //     return await this.tablesManagementService.changeStatus(id, body);
  // }
}

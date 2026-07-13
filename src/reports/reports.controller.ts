import { Controller, Get, NotFoundException, Param, Put } from '@nestjs/common';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Get('closed-bills-report')
  async printClosedBillsReport() {
    try {
      const result = await this.reportsService.printClosedBillsReport();
      if (!result) {
        throw new NotFoundException('No se ha podido imprimir el reporte');
      }
      return result;
    } catch (error) {
      throw new NotFoundException('No se ha podido imprimir el reporte');
    }
  }

  @Get('worked-time-report')
  async printWorkedTimeReport() {
    try {
      const result = await this.reportsService.printWorkedTimeReport();
      if (!result) {
        throw new NotFoundException('No se ha podido imprimir el reporte');
      }
      return result;
    } catch (error) {
      throw new NotFoundException('No se ha podido imprimir el reporte');
    }
  }

  @Put('worked-time-report/:id')
  async printWorkedTimeReportHistory(@Param('id') id: string) {
    try {
      const result = await this.reportsService.printWorkedTimeReport(id);
      if (!result) {
        throw new NotFoundException('No se ha podido imprimir el reporte');
      }
      return result;
    } catch (error) {
      throw new NotFoundException('No se ha podido imprimir el reporte');
    }
  }
}

import { Body, Controller, InternalServerErrorException, Param, Patch, Post } from '@nestjs/common';
import { PeriodsService } from '../services/periods.service';

@Controller('periods')
export class PeriodsController {
  constructor(private readonly periodsService: PeriodsService) {}

  @Post('convert-period/:periodId')
  convertPeriod(@Param('periodId') periodId: string) {
    try {
      const response = this.periodsService.convertPeriod(periodId);
      return response;
    } catch (error) {
      throw new InternalServerErrorException(`Error al convertir el periodo: ${error}`);
    }
  }

  @Patch('modify-properties/:periodId')
  // poner aqui un dto en lugar del any para el body
  modifyProperties(@Param('periodId') periodId: string, @Body() body: any) {
    try {
      const response = this.periodsService.rewritePeriodModifyProperties(periodId, body);
      return response;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al modificar las propiedades del periodo: ${error}`,
      );
    }
  }
}

import {
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { ClousureService } from '../services/clousure.service';

@Controller('clousure')
export class ClousureController {
  constructor(private readonly clousureService: ClousureService) {}
  // este end point

  @Get('daily-clousure/:periodId')
  async dailyClousure(@Param('periodId') periodId: string) {
    try {
      const response = await this.clousureService.dailyClousure(periodId);
      if (!response) throw new NotFoundException('No se encontro ninguna cuenta');
      return response;
    } catch (error) {
      throw new InternalServerErrorException(`Error al ejecutar el servicio de clousure: ${error}`);
    }
  }
}

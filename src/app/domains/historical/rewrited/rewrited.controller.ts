import { Controller, Get, InternalServerErrorException } from '@nestjs/common';
import { RewritedService } from './integrations/rewrited.service';

@Controller('rewrited')
export class RewritedController {
  constructor(private readonly rewritedService: RewritedService) {}

  @Get('periods/all')
  async findAll() {
    try {
      const response = await this.rewritedService.findAll();
      return response;
    } catch (error) {
      throw new InternalServerErrorException(`Error al obtener la información: ${error}`);
    }
  }
}

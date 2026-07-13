import { Body, Controller, Get, Inject, InternalServerErrorException, Param, Post, Query } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreatePeriodStatsCommand } from '../../../../core/application/entrypoint/commands/createPeriodStatsCommand';
import { GetListStatsQuery } from '../../../../core/application/entrypoint/queries/GetStatList.query';
import { GetOperatingPeriodsByMonthQuery } from '../../../../core/application/entrypoint/queries/GetOperatingPeriodsByMonth.query';
import { ClientProxy } from '@nestjs/microservices/client/client-proxy';
import { TAUNTER_SERVICE } from '../../../../shared/constants';
import { TAUNTER_REQUEST_EVENT } from '../../../../shared/events.const';

@Controller('period-stats')
export class PeriodStatsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    @Inject(TAUNTER_SERVICE) private readonly taunterClient: ClientProxy,
  ) {}


  @Get('generate/:id')
  async generate(@Param('id') id: string) {
    try {
      await this.commandBus.execute(new CreatePeriodStatsCommand(id));
      return { message: `Period stats generated successfully for period ID: ${id}` };
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to generate period stats for period ID: ${id}. Error: ${error}`,
      );
    }
  }

  @Get()
  async getAll() {
    const QUERY = new GetListStatsQuery();
    try {
      const stats = await this.queryBus.execute(QUERY);
      return stats;
    } catch (error) {
      throw new InternalServerErrorException(`Failed to retrieve period stats. Error: ${error}`);
    }
  }

  @Get('by-month')
  async getByMonth(@Query('month') month: string) {

    const QUERY = new GetOperatingPeriodsByMonthQuery(month);

    try {
      if (!month) {
        throw new Error('Month parameter is required (format: YYYY-MM)');
      }
      const periods = await this.queryBus.execute(QUERY);
      if (!periods.length) return [];
      return {
        month,
        count: periods.length,
        data: periods,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to retrieve operating periods for month ${month}. Error: ${error}`,
      );
    }
  }

  @Post('taunter-request')
  async sendTaunterRequest(@Body() body: any) {
    try {
      this.taunterClient.emit(TAUNTER_REQUEST_EVENT, body)
      return { message: 'Taunt sent successfully'  }
    } catch (error) {
      throw new InternalServerErrorException(`Failed to send taunt. Error: ${error}`);
    }
  }
}

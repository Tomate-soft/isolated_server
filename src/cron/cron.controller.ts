import { Controller} from '@nestjs/common';
import { CronService } from './cron.service';

@Controller('cron')
export class CronController {
  constructor(private readonlycronService: CronService) {}

  // @Get('test')
  // async test() {
  //   try {
  //     const res = await this.readonlycronService.initializeCronJobs();
  //     return res;
  //   } catch (error) {
  //     throw new NotFoundException(`Ha ocurrido algo inesperado. Mas informacion: ${error}`);
  //   }
  // }

  // @Post('close-manual-period')
  // async closeManualPeriod(@Body() body: any) {
  //   try {
  //     const res = await this.readonlycronService.closeManualPeriod(body);
  //     return res;
  //   } catch (error) {
  //     throw new NotFoundException(`Ha ocurrido algo inesperado. Mas informacion: ${error}`);
  //   }
  // }

  // @Get('create-manual-period')
  // async createManualPeriod() {
  //   try {
  //     const res = await this.readonlycronService.createPeriodForBranch();
  //     return res;
  //   } catch (error) {
  //     throw new NotFoundException(`Ha ocurrido algo inesperado. Mas informacion: ${error}`);
  //   }
  // }

  // @Post('create-source-period')
  // async createSourcePeriod() {
  //   try {
  //     const res = await this.readonlycronService.createSourcePeriod();
  //     return res;
  //   } catch (error) {
  //     throw new NotFoundException(
  //       `Ha ocurrido algo inesperado. Mas informacion: ${error}`,
  //     );
  //   }
  // }
}

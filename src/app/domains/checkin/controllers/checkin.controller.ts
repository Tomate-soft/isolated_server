import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CheckinService } from '../services/checkin.service';
import { CheckInRegister } from 'src/schemas/operatingPeriod/operatingPeriod.schema';

@Controller('checkin')
export class CheckinController {
  constructor(private readonly checkinService: CheckinService) {}

  @Get('/period-table-register')
  async getPeriodTableRegister() {
    try {
      const data = await this.checkinService.getPeriodTableRegister();
      return data;
    } catch (error) {
      throw new InternalServerErrorException('Error fetching period table register', error.message);
    }
  }

  @Post('/add-table-checkin-registers')
  async addTableCheckinRegisters(@Body() checkinRegisters: CheckInRegister[]) {
    console.log('Received check-in registers:', checkinRegisters);
    try {
      const data = await this.checkinService.addTableCheckinRegisters(checkinRegisters);
      return data;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error adding table check-in registers',
        error.message,
      );
    }
  }

  @Put('/table-aperture-checkin/:tableId')
  async tableApertureCheckin(@Body() body: { diners: number }, @Param('tableId') tableId: string) {
    try {
      const response = await this.checkinService.tableApertureCheckin(tableId, body.diners);
      return response;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error updating table aperture check-in',
        error.message,
      );
    }
  }

  // hexagonal
  @Get('/wait-list')
  async getWaitList() {
    try {
      const data = await this.checkinService.getWaitList();
      return data;
    } catch (error) {
      throw new InternalServerErrorException('Error fetching wait list', error.message);
    }
  }

  @Post('/wait-list')
  async createWaitListRegister(@Body() register: CheckInRegister) {
    try {
      const data = await this.checkinService.createWaitListRegister(register);
      return data;
    } catch (error) {
      throw new InternalServerErrorException('Error creating wait list register', error.message);
    }
  }

  @Delete('/wait-list/:idempotencyKey')
  async deleteWaitListRegister(@Param('idempotencyKey') idempotencyKey: string) {
    try {
      const data = await this.checkinService.deleteWaitListRegister(idempotencyKey);
      return data;
    } catch (error) {
      throw new InternalServerErrorException('Error deleting wait list register', error.message);
    }
  }

  @Put('/wait-list/:idempotencyKey')
  async updateWaitListRegister(
    @Param('idempotencyKey') idempotencyKey: string,
    @Body() register: Partial<CheckInRegister>,
  ) {
    try {
      const data = await this.checkinService.updateWaitListRegister(idempotencyKey, register);
      return data;
    } catch (error) {
      throw new InternalServerErrorException('Error updating wait list register', error.message);
    }
  }

  @Put('/wait-list/:idempotencyKey/approve')
  async approveWaitlistEntry(
    @Param('idempotencyKey') idempotencyKey: string,
    @Body() body: { tableId: string; diners: number },
  ) {
    try {
      const data = await this.checkinService.approveWaitlistEntry(
        idempotencyKey,
        body.tableId,
        body.diners,
      );
      return data;
    } catch (error) {
      throw new InternalServerErrorException('Error approving wait list entry', error.message);
    }
  }
}

import { Body, Controller, InternalServerErrorException, Param, Post } from '@nestjs/common';
import { ActionsService } from '../services/actions.service';

@Controller('actions')
export class ActionsController {
  constructor(private actionsService: ActionsService) {}
  @Post('transfer-bill-for-user/:id')
  async transferBillForUser(@Param('id') id: string, @Body() body: any) {
    try {
      return await this.actionsService.transferBillForUser(id, body);
    } catch (error) {
      throw new InternalServerErrorException(`Error al transferir la cuenta: ${error}`);
    }
  }
}

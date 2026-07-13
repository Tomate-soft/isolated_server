import { Injectable } from '@nestjs/common';
import { TransferBillForUserService } from './transfer-bill-for-user.service';

@Injectable()
export class ActionsService {
  constructor(private transferBillForUserService: TransferBillForUserService) {}

  async transferBillForUser(id: string, body: any) {
    return await this.transferBillForUserService.transferBillForUser(id, body);
  }
}

import { Injectable } from '@nestjs/common';
import { OperationsIntegrationsService } from '../../integrations/integrations.service';

@Injectable()
export class TransferBillForUserService {
  constructor(private readonly integrations: OperationsIntegrationsService) {}
  async transferBillForUser(id: string, body: any) {
    return await this.integrations.transferTableForUser(id, body);
  }
}

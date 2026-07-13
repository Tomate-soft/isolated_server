import { Injectable } from '@nestjs/common';
import { OperationsIntegrationsService } from '../../integrations/integrations.service';

@Injectable()
export class PhonePaymentsService {
  constructor(private readonly integrations: OperationsIntegrationsService) {}

  async payPhoneOrder(id: string, body: any) {
    const response = await this.integrations.payPhoneOrder(id, body);
    return response;
  }
}

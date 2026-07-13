import { Injectable } from '@nestjs/common';
import { OperationsIntegrationsService } from '../../integrations/integrations.service';

@Injectable()
export class TogoPaymentsService {
  constructor(private readonly integrations: OperationsIntegrationsService) {}

  async payTogoOrder(id: string, body: any) {
    const response = await this.integrations.payTogoOrder(id, body);
    return response;
  }
}

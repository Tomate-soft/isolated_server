import { Injectable } from '@nestjs/common';
import { OperationsIntegrationsService } from '../../integrations/integrations.service';

@Injectable()
export class RappiPaymentsService {
  constructor(private readonly integrations: OperationsIntegrationsService) {}

  async payRappiOrder(id: string, body: any) {
    const response = await this.integrations.payRappiOrder(id, body);
    return response;
  }
}

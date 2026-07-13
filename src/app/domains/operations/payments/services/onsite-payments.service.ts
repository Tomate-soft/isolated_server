import { Injectable } from '@nestjs/common';
import { OperationsIntegrationsService } from '../../integrations/integrations.service';

@Injectable()
export class OnsitePaymentsService {
  constructor(private readonly integrations: OperationsIntegrationsService) {}

  async payOnsiteOrder(id: string, body: any) {
    const response = await this.integrations.payOnsiteOrder(id, body);
    return response;
  }

  async payNoteInBill(id: string, body: any) {
    const response = await this.integrations.payNoteInBill(id, body);
    return response;
  }
}

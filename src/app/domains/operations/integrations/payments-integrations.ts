import { Injectable } from '@nestjs/common';
import { DataQuery } from 'src/app/data/data.query';

@Injectable()
export class PaymentsIntegrations {
  constructor(private readonly dataQuery: DataQuery) {}

  async payOnsiteOrder(id: string, body: any) {
    const response = await this.dataQuery.paymentsQuery.payOnsiteOrder(id, body);
    return response;
  }

  async payTogoOrder(id: string, body: any) {
    const response = await this.dataQuery.paymentsQuery.payTogoOrder(id, body);
    return response;
  }

  async payRappiOrder(id: string, body: any) {
    const response = await this.dataQuery.paymentsQuery.payRappiOrder(id, body);
    return response;
  }

  async payPhoneOrder(id: string, body: any) {
    const response = await this.dataQuery.paymentsQuery.payPhoneOrder(id, body);
    return response;
  }

  async payNoteInBill(id: string, body: any) {
    const response = await this.dataQuery.paymentsQuery.payNoteInBill(id, body);
    return response;
  }
}

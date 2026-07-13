import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from 'src/dto/ventas/payments/createPaymentDto';
import { PayOnsiteQueries } from './pay-onsite-queries';
import { PayWithCourtesies } from './pay-with-courtesies';
import { PayRappiQueries } from './pay-rappi-queries';
import { PayPhoneQueries } from './pay-phone-queries';
import { PayTogoQueries } from './pay-togo-queries';

@Injectable()
export class PaymentsQueries {
  constructor(
    private readonly payOnsiteQueries: PayOnsiteQueries,
    private readonly payWithCourtesies: PayWithCourtesies,
    private readonly payRappiQueries: PayRappiQueries,
    private readonly payPhoneQueries: PayPhoneQueries,
    private readonly payTogoQueries: PayTogoQueries,
  ) {}

  async payOnsiteOrder(id: string, body: CreatePaymentDto): Promise<any> {
    return await this.payOnsiteQueries.payOnsiteOrder(id, body);
  }

  async payOnsiteOrderWithCourtesy(id: string, body: any): Promise<any> {
    return await this.payOnsiteOrderWithCourtesy(id, body);
  }

  async payRappiOrder(id: string, body: any): Promise<any> {
    return await this.payRappiQueries.payTogoOrder(id, body);
  }

  async payPhoneOrder(id: string, body: any): Promise<any> {
    return await this.payPhoneQueries.payPhoneOrder(id, body);
  }

  async payTogoOrder(id: string, body: any): Promise<any> {
    return await this.payTogoQueries.payTogoOrder(id, body);
  }
  async payNoteInBill(id: string, body: any): Promise<any> {
    return await this.payOnsiteQueries.payNoteInBill(id, body);
  }
}

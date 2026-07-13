import { Injectable } from '@nestjs/common';
import { OnsitePaymentsService } from './onsite-payments.service';
import { RappiPaymentsService } from './rappi-payments.service';
import { PhonePaymentsService } from './phone-payments.service';
import { TogoPaymentsService } from './togo-payments.service';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly onsitePaymentsService: OnsitePaymentsService,
    private readonly rappiPaymentsService: RappiPaymentsService,
    private readonly phonePaymentsService: PhonePaymentsService,
    private readonly togoPaymentsService: TogoPaymentsService,
  ) {}

  async payOnsiteOrder(id: string, body: any) {
    const response = await this.onsitePaymentsService.payOnsiteOrder(id, body);
    return response;
  }

  async payTogoOrder(id: string, body: any) {
    const response = await this.togoPaymentsService.payTogoOrder(id, body);
    return response;
  }

  async payRappiOrder(id: string, body: any) {
    const response = await this.rappiPaymentsService.payRappiOrder(id, body);
    return response;
  }

  async payPhoneOrder(id: string, body: any) {
    const response = await this.phonePaymentsService.payPhoneOrder(id, body);
    return response;
  }

  async payNoteInBill(id: string, body: any) {
    const response = await this.onsitePaymentsService.payNoteInBill(id, body);
    return response;
  }
}

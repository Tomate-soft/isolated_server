import { Injectable } from '@nestjs/common';
import { BillsIntegrationsService } from './bills-integrations.service';
import { TogoIntegration } from './togo.integration';
import { RappiIntegrations } from './rappi-integrations';
import { PhoneIntegrations } from './phone-integrations';
import { NotifyIntegrations } from './notify-integrations';
import { CancellationsIntegrations } from './cancellations-integrations';
import { TableIntegrations } from './table-integrations';
import { FREE_STATUS } from 'src/libs/status.libs';
import { CancellationTypes } from '@schema/cancellations/order-cancel.schema';
import { PaymentsIntegrations } from './payments-integrations';
import { ActionsIntegration } from './actions-integration';
import { CancellationProductTypes } from '@schema/cancellations/product-cancel.schema';
import { UserIntegrations } from './user-integrations';

@Injectable()
export class OperationsIntegrationsService {
  constructor(
    private readonly billsIntegrations: BillsIntegrationsService,
    private readonly togoIntegration: TogoIntegration,
    private readonly rappiIntegration: RappiIntegrations,
    private readonly phoneIntegration: PhoneIntegrations,
    private readonly notifyIntegration: NotifyIntegrations,
    private readonly cancellationsIntegration: CancellationsIntegrations,
    private readonly tablesIntegration: TableIntegrations,
    private readonly paymentsIntegrations: PaymentsIntegrations,
    private readonly actionsIntegration: ActionsIntegration,
    private readonly userIntegrations: UserIntegrations,
  ) {}

  // restaurant
  async getAllBills() {
    const response = await this.billsIntegrations.readBills();
    return response;
  }

  async getAllPeriodBills(operatingPeriod: string) {
    const response = await this.billsIntegrations.readBillsByPeriod(operatingPeriod);
    return response;
  }

  async modifyOnSiteOrderProperties(id: string, body: any) {
    const response = await this.billsIntegrations.modifyOnSiteOrderProperties(id, body);
    return response;
  }

  // togo
  async getAllTogoOrders(page: number, limit: number) {
    const response = await this.togoIntegration.getAllTogoOrders(page, limit);
    return response;
  }

  async getAllPeriodTogoOrders(operatingPeriod: string) {
    const response = await this.getAllPeriodTogoOrders(operatingPeriod);
    return response;
  }

  async modifyTogoOrderProperties(id: string, body: any) {
    const response = await this.togoIntegration.modifyTogoOrderProperties(id, body);
    return response;
  }

  // rappi
  async getAllRappiOrders(page: number, limit: number) {
    const response = await this.rappiIntegration.getAllRappiOrders(page, limit);
    return response;
  }

  async getAllPeriodRappiOrders(operatingPeriod: string) {
    const response = await this.rappiIntegration.getAllPeriodRappiOrders(operatingPeriod);
    return response;
  }

  async modifyRappiOrderProperties(id: string, body: any) {
    const response = await this.rappiIntegration.modifyRappiOrderProperties(id, body);
    return response;
  }

  // phone
  async getAllPhoneOrders(page: number, limit: number) {
    const response = await this.phoneIntegration.getAllPhoneOrders(page, limit);
    return response;
  }

  async getAllPeriodPhoneOrders(operatingPeriod: string) {
    const response = await this.phoneIntegration.getAllPeriodPhoneOrders(operatingPeriod);
    return response;
  }

  async modifyPhoneOrderProperties(id: string, body: any) {
    const response = await this.phoneIntegration.modifyPhoneOrderProperties(id, body);
    return response;
  }

  async sendTelegramMessage(message: string) {
    const response = await this.notifyIntegration.sendTelegramMessage(message);
    return response;
  }
  // aqui estoy encimando un endpoint con este metodo cualquier productType tambnien estos hay que separarlos y usar el de product cancel non el orderCancel
  // probablemente fuera del cancelEvent haya que hacer otro metodo para los product cancellations

  // cancellations
  async cancelOrderEvent(
    type: CancellationTypes | CancellationProductTypes,
    id: string,
    body: any,
  ) {
    const response = await this.cancellationsIntegration.cancelEvent(type, id, body);
    return response;
  }

  // tables
  async modifyTableProperties(id: string, body: any) {
    const response = await this.tablesIntegration.modifyTableProperties(id, body);
    return response;
  }

  async getToNextRelease() {
    const response = await this.tablesIntegration.toNextRelease();
    return response;
  }

  async openTableForCancellation(id: string) {
    const response = await this.tablesIntegration.modifyTableProperties(id, {
      status: FREE_STATUS,
      bill: [],
    });
    return response;
  }

  // payments
  async payOnsiteOrder(id: string, body: any) {
    const response = await this.paymentsIntegrations.payOnsiteOrder(id, body);
    return response;
  }

  async payTogoOrder(id: string, body: any) {
    const response = await this.paymentsIntegrations.payTogoOrder(id, body);
    return response;
  }

  async payRappiOrder(id: string, body: any) {
    const response = await this.paymentsIntegrations.payRappiOrder(id, body);
    return response;
  }

  async payPhoneOrder(id: string, body: any) {
    const response = await this.paymentsIntegrations.payPhoneOrder(id, body);
    return response;
  }

  async payNoteInBill(id: string, body: any) {
    const response = await this.paymentsIntegrations.payNoteInBill(id, body);
    return response;
  }

  //operations
  async transferTableForUser(id: string, body: any) {
    const response = await this.actionsIntegration.transferTableForUser(id, body);
    return response;
  }

  // users
  async changeUserPassword(userId: string, newPassword: number) {
    const response = await this.userIntegrations.changeUserPassword(userId, newPassword);
    return response;
  }
}

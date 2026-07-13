import { Injectable } from '@nestjs/common';
import { OperationsIntegrationsService } from '../../integrations/integrations.service';
import { CancellationTypes } from '@schema/cancellations/order-cancel.schema';
import { CreateOrderCancelProps } from '../types/cancellations';
// force update
import {
  toCancelOnSiteOrderMessage,
  toCancelPhoneOrderMessage,
  toCancelRappiOrderMessage,
  toCancelTogoOrderMessage,
  toCancelToGoProductMessage,
} from '../helpers/cancel-messages';
import { CancellationProductTypes } from '@schema/cancellations/product-cancel.schema';

@Injectable()
export class CancellationsService {
  constructor(private readonly integrations: OperationsIntegrationsService) {}

  async cancelTogoOrder(id: string, body: CreateOrderCancelProps) {
    const response = await this.integrations.cancelOrderEvent(
      CancellationTypes.TOGO_ORDER_CANCELLATION,
      id,
      body,
    );
    console.log('este es elk response');
    console.log(response);
    await this.integrations.sendTelegramMessage(toCancelTogoOrderMessage(response));
  }

  async cancelRappiOrder(id: string, body: CreateOrderCancelProps) {
    const response = await this.integrations.cancelOrderEvent(
      CancellationTypes.RAPPI_ORDER_CANCELLATION,
      id,
      body,
    );
    await this.integrations.sendTelegramMessage(toCancelRappiOrderMessage(response));
  }

  async cancelPhoneOrder(id: string, body: CreateOrderCancelProps) {
    const response = await this.integrations.cancelOrderEvent(
      CancellationTypes.PHONE_ORDER_CANCELLATION,
      id,
      body,
    );
    await this.integrations.sendTelegramMessage(toCancelPhoneOrderMessage(response));
  }

  async cancelOnSiteOrder(id: string, body: CreateOrderCancelProps) {
    const response = await this.integrations.cancelOrderEvent(
      CancellationTypes.BILL_CANCELLATION,
      id,
      body,
    );
    await this.integrations.sendTelegramMessage(toCancelOnSiteOrderMessage(response));
  }

  async cancelTogoProduct(id: string, body: any) {
    const response = await this.integrations.cancelOrderEvent(
      CancellationProductTypes.TOGO_ORDER_PRODUCT_CANCELLATION,
      id,
      body,
    );
    await this.integrations.sendTelegramMessage(toCancelToGoProductMessage(response));
    return response;
  }

  async cancelRappiProduct(id: string, body: any) {
    const response = await this.integrations.cancelOrderEvent(
      CancellationProductTypes.RAPPI_ORDER_PRODUCT_CANCELLATION,
      id,
      body,
    );
    return response;
  }

  async cancelPhoneProduct(id: string, body: any) {
    const response = await this.integrations.cancelOrderEvent(
      CancellationProductTypes.PHONE_ORDER_PRODUCT_CANCELLATION,
      id,
      body,
    );
    return response;
  }
}

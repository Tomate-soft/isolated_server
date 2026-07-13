import { CreateOrderCancelDto } from 'src/app/data/dto/cancellations/order-cancel/create-order-cancel.dto';
import { CreateProductCancelDto } from 'src/app/data/dto/cancellations/product-cancel/create-product-cancel.dto';
import { formatToCurrency } from 'src/libs/formatToCurrency';

export const toCancelTogoOrderMessage = (data: CreateOrderCancelDto): string => {
  return (
    '⚠️ Notificación de Cancelación de Cuenta Para llevar \n\n' +
    `🔒 Autorizado por: ${data.cancellationBy}\n` +
    `💼 Atendida por: ${data.cancellationFor}\n` +
    `🧾 ID de orden: ${data.code}\n` +
    `💲 Total cancelado: $${formatToCurrency(data.amount) || '0.00'}\n` +
    `🏬 Motivo: ${data.cancellationReason} : ${data.description}\n\n` +
    'Si no reconoces esta acción, por favor comunícate de inmediato con el área de administración.'
  );
};

export const toCancelRappiOrderMessage = (data: CreateOrderCancelDto): string => {
  return (
    '⚠️ Notificación de Cancelación de Cuenta en Rappi \n\n' +
    `🔒 Autorizado por: ${data.cancellationBy}\n` +
    `💼 Atendida por: ${data.cancellationFor}\n` +
    `🧾 ID de orden: ${data.code}\n` +
    `💲 Total cancelado: $${formatToCurrency(data.amount) || '0.00'}\n` +
    `🏬 Motivo: ${data.cancellationReason} : ${data.description}\n\n` +
    'Si no reconoces esta acción, por favor comunícate de inmediato con el área de administración.'
  );
};

export const toCancelPhoneOrderMessage = (data: CreateOrderCancelDto): string => {
  return (
    '⚠️ Notificación de Cancelación de Cuenta Telefonico \n\n' +
    `🔒 Autorizado por: ${data.cancellationBy}\n` +
    `💼 Atendida por: ${data.cancellationFor}\n` +
    `🧾 ID de orden: ${data.code}\n` +
    `💲 Total cancelado: $${formatToCurrency(data.amount) || '0.00'}\n` +
    `🏬 Motivo: ${data.cancellationReason} : ${data.description}\n\n` +
    'Si no reconoces esta acción, por favor comunícate de inmediato con el área de administración.'
  );
};

export const toCancelOnSiteOrderMessage = (data: CreateOrderCancelDto): string => {
  return (
    '⚠️ Notificación de Cancelación de Cuenta en Restaurante \n\n' +
    `🔒 Autorizado por: ${data.cancellationBy}\n` +
    `💼 Atendida por: ${data.cancellationFor}\n` +
    `🍽️ Mesa: ${data.description.split(':')[0]}\n` +
    `🧾 ID de orden: ${data.code}\n` +
    `💲 Total cancelado: $${formatToCurrency(data.amount) || '0.00'}\n` +
    `🏬 Motivo: ${data.description}\n\n` +
    'Si no reconoces esta acción, por favor comunícate de inmediato con el área de administración.'
  );
};

export const toCancelToGoProductMessage = (data: CreateProductCancelDto): string => {
  return (
    '⚠️ Notificación de Cancelación de producto en cuenta Para llevar\n\n' +
    'Se ha cancelado un producto en el sistema.\n\n' +
    `🔒 Autorizado por: ${data.cancellationBy}\n` +
    `💼 Atendida por: ${data.cancellationFor}\n` +
    `🍽️ Producto cancelado: ${data.product}\n` +
    `🧾 Cuenta: ${data.code}\n` +
    `💲 Total cancelado: $${formatToCurrency(data.amount) || '0.00'}\n` +
    `🏬 Motivo: ${data.cancellationReason} : ${data.description}\n\n` +
    'Si no reconoces esta acción, por favor comunícate de inmediato con el área de administración.'
  );
};

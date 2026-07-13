import { CURRENCY_CODE_REGEX } from './constants/regex';

/**
 * Value Object que encapsula el código de moneda del tenant.
 *
 * - Formato: ISO-4217 (tres letras mayúsculas, ej: MXN, USD, EUR).
 * - Se normaliza a mayúsculas automáticamente.
 * - Usado para formatear precios, reportes y para la integración
 *   con pasarelas de pago y sistemas contables.
 * - RF-01.3: parte de la configuración regional del tenant.
 */
export class TenantCurrencyCode {
  private readonly value: string;

  constructor(value: string) {
    const normalized = value?.trim().toUpperCase();

    if (!CURRENCY_CODE_REGEX.test(normalized)) {
      throw new Error('currency_code must be an ISO-4217 code');
    }

    this.value = normalized;
  }

  getValue(): string {
    return this.value;
  }
}

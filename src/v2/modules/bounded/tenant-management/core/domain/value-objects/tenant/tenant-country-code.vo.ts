import { COUNTRY_CODE_REGEX } from './constants/regex';

/**
 * Value Object que encapsula el código de país del tenant.
 *
 * - Formato: ISO-3166-1 alpha-2 (dos letras mayúsculas, ej: MX, US, ES).
 * - Se normaliza a mayúsculas automáticamente.
 * - Determina la jurisdicción legal del tenant y puede influir
 *   en la configuración fiscal y los formatos de fecha/número.
 * - RF-01.3: parte de la configuración regional del tenant.
 */
export class TenantCountryCode {
  private readonly value: string;

  constructor(value: string) {
    const normalized = value?.trim().toUpperCase();

    if (!COUNTRY_CODE_REGEX.test(normalized)) {
      throw new Error('country_code must be an ISO-3166-1 alpha-2 code');
    }

    this.value = normalized;
  }

  getValue(): string {
    return this.value;
  }
}

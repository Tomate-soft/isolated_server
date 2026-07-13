import { TENANT_TAX_ID_MAX_LENGTH } from './constants/values';

/**
 * Value Object que encapsula el identificador fiscal del tenant.
 *
 * Ejemplos por país:
 *   - México: RFC (ej: "XAXX010101000")
 *   - EEUU: EIN (ej: "12-3456789")
 *   - España: NIF (ej: "B12345678")
 *
 * Se mantiene como string libre (sin regex de formato) para soportar
 * múltiples jurisdicciones. La validación del formato puede aplicarse
 * en la capa de aplicación si se requiere por país específico.
 *
 * - No puede estar vacío.
 * - Máximo {@link TENANT_TAX_ID_MAX_LENGTH} caracteres.
 * - RF-01.3: parte de la configuración fiscal del tenant.
 */
export class TenantTaxId {
  constructor(private readonly value: string) {
    if (!value?.trim()) {
      throw new Error('tenant tax id is required');
    }

    if (value.trim().length > TENANT_TAX_ID_MAX_LENGTH) {
      throw new Error(`tenant tax id must be at most ${TENANT_TAX_ID_MAX_LENGTH} characters`);
    }
  }

  getValue(): string {
    return this.value.trim();
  }
}

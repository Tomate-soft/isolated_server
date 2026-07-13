import { TENANT_LEGAL_NAME_MAX_LENGTH } from './constants/values';

/**
 * Value Object que encapsula la razón social o nombre legal del tenant.
 *
 * Diferencia con {@link TenantName}:
 *   - `TenantName` es el nombre comercial (visible al usuario).
 *   - `TenantLegalName` es la denominación fiscal/jurídica (ej: "El Tomate S.A. de C.V.").
 *
 * - No puede estar vacío.
 * - Máximo {@link TENANT_LEGAL_NAME_MAX_LENGTH} caracteres (trimmed).
 * - RF-01.3: parte de la configuración base del tenant.
 */
export class TenantLegalName {
  constructor(private readonly value: string) {
    if (!value?.trim()) {
      throw new Error('tenant legal name is required');
    }

    if (value.trim().length > TENANT_LEGAL_NAME_MAX_LENGTH) {
      throw new Error(
        `tenant legal name must be at most ${TENANT_LEGAL_NAME_MAX_LENGTH} characters`,
      );
    }
  }

  getValue(): string {
    return this.value.trim();
  }
}

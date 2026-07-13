import { TENANT_NAME_MAX_LENGTH } from './constants/values';

/**
 * Value Object que encapsula el nombre comercial del tenant.
 *
 * - No puede estar vacío ni ser solo espacios.
 * - Máximo {@link TENANT_NAME_MAX_LENGTH} caracteres (trimmed).
 * - Se normaliza eliminando espacios al inicio/fin en `getValue()`.
 * - RF-01.3: forma parte de la configuración base del tenant.
 */
export class TenantName {
  constructor(private readonly value: string) {
    if (!value?.trim()) {
      throw new Error('tenant name is required');
    }

    if (value.trim().length > TENANT_NAME_MAX_LENGTH) {
      throw new Error(`tenant name must be at most ${TENANT_NAME_MAX_LENGTH} characters`);
    }
  }

  getValue(): string {
    return this.value.trim();
  }
}

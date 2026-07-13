import { UUID_REGEX } from './constants/regex';

/**
 * Value Object que encapsula el identificador único de un tenant.
 *
 * - Formato: UUID v1-v8 (RFC 4122).
 * - Inmutable: una vez creado, el ID no puede cambiar.
 * - Generado por la capa de dominio al crear el tenant (randomUUID).
 */
export class TenantId {
  constructor(private readonly value: string) {
    if (!UUID_REGEX.test(value)) {
      throw new Error('tenant id must be a valid UUID');
    }
  }

  getValue(): string {
    return this.value;
  }
}

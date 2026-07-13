/**
 * Value Object que encapsula la referencia al tenant propietario de una licencia.
 *
 * Existe como tipo propio dentro del subdominio `license-keys` para respetar
 * la encapsulación: {@link LicenseKeyEntity} no importa nada del aggregate `Tenant`.
 * La relación entre entidades se expresa solo a través de primitivos (IDs).
 *
 * - Formato: UUID (cualquier variante).
 * - Inmutable: una licencia siempre pertenece al mismo tenant.
 */
export class TenantId {
  private static readonly UUID_REGEX =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  constructor(private readonly value: string) {
    if (!TenantId.UUID_REGEX.test(value)) {
      throw new Error('TenantId must be a valid UUID');
    }
  }
  getValue(): string {
    return this.value;
  }
}

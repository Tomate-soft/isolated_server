/**
 * Value Object que encapsula la fecha de última modificación del tenant.
 *
 * - Mutable: se reemplaza en cada operación que cambia el estado del tenant
 *   (`updateProfile`, `updateSecurityPolicy`, `activate`, `suspend`, `delete`).
 * - No `readonly` en {@link TenantEntity}, a diferencia de `TenantCreatedAt`.
 * - Lanza error si el valor no es una instancia válida de `Date`.
 */
export class TenantUpdatedAt {
  constructor(private readonly value: Date) {
    if (!(value instanceof Date) || Number.isNaN(value.getTime())) {
      throw new Error('updated_at must be a valid date');
    }
  }

  getValue(): Date {
    return this.value;
  }
}

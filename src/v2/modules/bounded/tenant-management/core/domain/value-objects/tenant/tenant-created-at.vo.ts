/**
 * Value Object que encapsula la fecha de creación del tenant.
 *
 * - Inmutable: se asigna una sola vez al crear el tenant y no puede modificarse.
 * - Separado de `TenantUpdatedAt` para dejar explícita la inmutabilidad en el constructor
 *   de {@link TenantEntity} (`readonly`).
 * - Lanza error si el valor no es una instancia válida de `Date`.
 */
export class TenantCreatedAt {
  constructor(private readonly value: Date) {
    if (!(value instanceof Date) || Number.isNaN(value.getTime())) {
      throw new Error('created_at must be a valid date');
    }
  }

  getValue(): Date {
    return this.value;
  }
}

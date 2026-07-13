/**
 * Estados posibles de una licencia a lo largo de su ciclo de vida.
 *
 * Transiciones válidas:
 *   ACTIVE → SUSPENDED | REVOKED | EXPIRED
 *   SUSPENDED → ACTIVE (reactivación)
 *   REVOKED → (terminal, no puede revertirse)
 *   EXPIRED → (terminal, debe emitirse una nueva licencia o renovarse)
 */
export enum LicenseStatusEnum {
  /** Licencia vigente y operativa. */
  ACTIVE = 'ACTIVE',

  /** Bloqueada temporalmente; puede reactivarse. */
  SUSPENDED = 'SUSPENDED',

  /** Revocada de forma permanente e inmediata. RF-02.6 */
  REVOKED = 'REVOKED',

  /** Superó su fecha de vencimiento y el grace period. RF-02.8 */
  EXPIRED = 'EXPIRED',
}

/**
 * Value Object que encapsula el estado de una licencia.
 *
 * Usa `static create()` para validar que solo se acepten valores del enum,
 * evitando strings arbitrarios en el dominio.
 */
export class LicenseStatus {
  private constructor(private readonly value: LicenseStatusEnum) {}

  static create(value: string): LicenseStatus {
    const up = value.toUpperCase() as LicenseStatusEnum;
    if (!Object.values(LicenseStatusEnum).includes(up)) {
      throw new Error('Invalid license status');
    }
    return new LicenseStatus(up);
  }

  getValue(): LicenseStatusEnum {
    return this.value;
  }
}

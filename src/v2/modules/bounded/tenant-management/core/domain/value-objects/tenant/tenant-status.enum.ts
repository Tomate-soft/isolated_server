/**
 * Ciclo de vida de un tenant en la plataforma.
 * RF-01.1: el sistema debe permitir crear, activar, suspender y eliminar tenants.
 *
 * Transiciones permitidas:
 *   ACTIVE → SUSPENDED → ACTIVE
 *   ACTIVE | SUSPENDED → DELETED (soft-delete lógico)
 */
export enum TenantStatus {
  /** Tenant operativo; puede autenticarse y consumir la plataforma. */
  ACTIVE = 'active',

  /** Acceso bloqueado temporalmente (ej: falta de pago, revisión administrativa). */
  SUSPENDED = 'suspended',

  /**
   * Eliminación lógica. El registro persiste en base de datos
   * pero no puede operar ni ser consultado por usuarios finales.
   */
  DELETED = 'deleted',
}

import { LicenseKeyPrimitives } from '../../types/LicenseKeyPrimitives';

/**
 * Input para emitir una nueva licencia a un tenant. RF-02.2
 * La firma digital (`signatureHash`) debe generarse en la capa de aplicación
 * o infraestructura usando HMAC-SHA256 o RSA antes de llamar al domain service. RF-02.4
 */
export interface IssueLicenseKeyInput {
  tenantId: string;
  /** Si se omite, el domain service genera un UUID como valor de clave. */
  licenseKey?: string;
  planType: string;
  maxBranches: number;
  maxUsers: number;
  featuresEnabled?: Record<string, unknown>;
  /** Fecha de inicio de vigencia. Si se omite, se usa la fecha actual. */
  validFrom?: Date;
  validUntil: Date;
  /** Días de gracia tras la expiración. RF-02.8 */
  graceDays?: number;
  /** Hash HMAC-SHA256 o RSA. RF-02.4 */
  signatureHash: string;
  issuedBy: string;
}

/**
 * Input para renovar una licencia existente.
 * Solo se actualizan los campos provistos; el resto conserva su valor actual.
 */
export interface RenewLicenseKeyInput {
  planType?: string;
  maxBranches?: number;
  maxUsers?: number;
  featuresEnabled?: Record<string, unknown>;
  validFrom?: Date;
  validUntil: Date;
  graceDays?: number;
  /** Nueva firma digital para la licencia renovada. RF-02.4 */
  signatureHash: string;
  issuedBy: string;
}

/**
 * Input para revocar una licencia de forma inmediata. RF-02.6
 * La revocación es irreversible.
 */
export interface RevokeLicenseKeyInput {
  revokedBy: string;
  revocationReason: string;
  revokedAt?: Date;
}

/** Input para activar una licencia previamente emitida. */
export interface ActivateLicenseKeyInput {
  activatedBy: string;
  activatedAt?: Date;
}

/**
 * Input para validar que un tenant puede realizar una operación específica.
 * Si algún campo supera el límite de la licencia, el domain service lanza error.
 * RF-02.3 (hard enforcement)
 */
export interface ValidateTenantOperationInput {
  /** Fecha de referencia. Si se omite, se usa la fecha actual. */
  asOf?: Date;
  /** Número de sucursales que la operación requiere. */
  requiredBranches?: number;
  /** Número de usuarios que la operación requiere. */
  requiredUsers?: number;
  /** Features que la operación requiere habilitadas. */
  requiredFeatures?: string[];
}

/**
 * Entrada del historial inmutable de eventos de licencia.
 * RF-02.7: cada operación (issue, activate, renew, revoke, expire) genera una entrada.
 */
export interface LicenseHistoryEntry {
  id: string;
  licenseKeyId: string;
  tenantId: string;
  eventType: 'created' | 'activated' | 'renewed' | 'revoked' | 'expired' | 'alerted';
  occurredAt: Date;
  /** Actor que disparó el evento (email, userId, sistema). */
  actor?: string;
  /** Datos adicionales del evento (plan anterior, motivo de revocación, etc.). */
  payload?: Record<string, unknown>;
}

/**
 * Configuración para la búsqueda de licencias próximas a vencer.
 * RF-02.5: el sistema emite alertas automáticas a 30, 15 y 7 días del vencimiento.
 */
export interface LicenseExpiryAlertConfig {
  /** Días antes del vencimiento para incluir en los resultados. */
  daysBeforeExpiration: 30 | 15 | 7 | number;
  /** Fecha de referencia. Si se omite, se usa la fecha actual. */
  asOf?: Date;
}

/**
 * Filtros de búsqueda para listar licencias.
 * Todos los campos son opcionales y se combinan con AND.
 */
export interface LicenseKeySearchFilters {
  tenantId?: string;
  planType?: string;
  status?: LicenseKeyPrimitives['status'];
  /** Incluir solo licencias que vencen dentro de N días. */
  expiringWithinDays?: number;
  asOf?: Date;
}

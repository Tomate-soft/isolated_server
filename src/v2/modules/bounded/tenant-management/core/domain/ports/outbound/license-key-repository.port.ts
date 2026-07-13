import { LicenseKeyEntity } from '../../entities/LicenseKeyEntity';
import { LicenseKeyPrimitives } from '../../types/LicenseKeyPrimitives';
import {
  LicenseExpiryAlertConfig,
  LicenseHistoryEntry,
  LicenseKeySearchFilters,
} from '../types/LicenseKey';

/**
 * Puerto de salida (outbound port) del aggregate `LicenseKey`.
 *
 * Además del CRUD estándar, expone métodos especializados de consulta
 * y escritura que reflejan los requerimientos del motor de licencias (RF-02):
 *   - Historial inmutable (RF-02.7)
 *   - Búsqueda de licencias por vencer (RF-02.5)
 *   - Revocación con propagación en tiempo real (RF-02.6)
 *   - Snapshot optimizado para validación de operaciones (RF-02.3)
 */
export interface LicenseKeyRepository {
  /** Persiste una licencia (insert o update). */
  save(licenseKey: LicenseKeyEntity): Promise<LicenseKeyEntity>;

  /** Busca una licencia por su ID. Devuelve `null` si no existe. */
  findById(licenseKeyId: string): Promise<LicenseKeyEntity | null>;

  /** Lista licencias con filtros opcionales (tenantId, planType, status, etc.). */
  findAll(filters?: LicenseKeySearchFilters): Promise<LicenseKeyEntity[]>;

  /**
   * Devuelve la licencia ACTIVE de un tenant en una fecha dada.
   * Respeta el grace period: una licencia expirada-dentro-del-grace sigue siendo "activa".
   * RF-02.1 / RF-02.8
   */
  findActiveByTenantId(tenantId: string, asOf?: Date): Promise<LicenseKeyEntity | null>;

  /**
   * Devuelve licencias próximas a vencer según la configuración de alerta.
   * RF-02.5: usado por el proceso CRON para emitir alertas a 30/15/7 días.
   */
  findExpiring(config: LicenseExpiryAlertConfig): Promise<LicenseKeyEntity[]>;

  /**
   * Verifica si existe al menos una licencia activa para el tenant.
   * Optimizado para evitar cargar la entidad completa. RF-02.1
   */
  existsActiveByTenantId(tenantId: string, asOf?: Date): Promise<boolean>;

  /**
   * Persiste una entrada en el historial inmutable de eventos de licencia.
   * RF-02.7: se llama tras cada operación (issue, activate, renew, revoke, expire).
   */
  saveHistory(entry: LicenseHistoryEntry): Promise<LicenseHistoryEntry>;

  /** Devuelve el historial completo de eventos de una licencia. RF-02.7 */
  findHistoryByLicenseKeyId(licenseKeyId: string): Promise<LicenseHistoryEntry[]>;

  /**
   * Marca una licencia como EXPIRED de forma directa.
   * Usado por el proceso CRON de expiración automática. RF-02.5
   */
  markAsExpired(licenseKeyId: string, expiredAt?: Date): Promise<void>;

  /**
   * Revoca una licencia de forma inmediata con propagación en tiempo real.
   * Método especializado para garantizar que la revocación sea atómica. RF-02.6
   */
  revoke(licenseKeyId: string, revokedAt: Date, reason: string): Promise<void>;

  /**
   * Devuelve un snapshot plano (primitives) de la licencia activa del tenant.
   * Optimizado para las validaciones de operación (RF-02.3) sin hidratar la entidad completa.
   */
  findCurrentSnapshotByTenantId(
    tenantId: string,
    asOf?: Date,
  ): Promise<LicenseKeyPrimitives | null>;
}

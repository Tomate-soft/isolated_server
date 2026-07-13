import { LicenseKeyPrimitives } from '../../../domain/types/LicenseKeyPrimitives';
import {
  ActivateLicenseKeyInput,
  IssueLicenseKeyInput,
  LicenseExpiryAlertConfig,
  LicenseHistoryEntry,
  LicenseKeySearchFilters,
  RenewLicenseKeyInput,
  RevokeLicenseKeyInput,
  ValidateTenantOperationInput,
} from '../../../domain/ports/types/LicenseKey';

/**
 * Contrato de la capa de aplicación para operaciones de licencias en `tenant-management`.
 *
 * La capa de aplicación define los casos de uso expuestos a infraestructura,
 * y delega las reglas puras al dominio (services/entities), coordinando concerns
 * de aplicación (autorización, transacciones, side-effects, etc.).
 */
export interface LicenseAppService {
  issue(input: IssueLicenseKeyInput): Promise<LicenseKeyPrimitives>;
  activate(licenseKeyId: string, input: ActivateLicenseKeyInput): Promise<LicenseKeyPrimitives>;
  renew(licenseKeyId: string, input: RenewLicenseKeyInput): Promise<LicenseKeyPrimitives>;
  revoke(licenseKeyId: string, input: RevokeLicenseKeyInput): Promise<LicenseKeyPrimitives>;

  getById(licenseKeyId: string): Promise<LicenseKeyPrimitives>;
  list(filters?: LicenseKeySearchFilters): Promise<LicenseKeyPrimitives[]>;
  listExpiring(config: LicenseExpiryAlertConfig): Promise<LicenseKeyPrimitives[]>;

  getActiveByTenantId(tenantId: string, asOf?: Date): Promise<LicenseKeyPrimitives>;
  hasActiveLicense(tenantId: string, asOf?: Date): Promise<boolean>;

  validateTenantOperation(tenantId: string, input?: ValidateTenantOperationInput): Promise<void>;
  canTenantOperate(tenantId: string, input?: ValidateTenantOperationInput): Promise<boolean>;

  getHistoryByLicenseKeyId(licenseKeyId: string): Promise<LicenseHistoryEntry[]>;
}

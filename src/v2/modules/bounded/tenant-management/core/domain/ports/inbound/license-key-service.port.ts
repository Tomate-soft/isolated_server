import { LicenseKeyPrimitives } from '../../types/LicenseKeyPrimitives';
import {
  ActivateLicenseKeyInput,
  IssueLicenseKeyInput,
  LicenseExpiryAlertConfig,
  LicenseHistoryEntry,
  LicenseKeySearchFilters,
  RenewLicenseKeyInput,
  RevokeLicenseKeyInput,
  ValidateTenantOperationInput,
} from '../types/LicenseKey';

export interface LicenseKeyService {
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

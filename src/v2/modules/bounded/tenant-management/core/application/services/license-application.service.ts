import { LicenseAppService } from '../ports/inbound/license-app-service.port';
import { LicenseKeyPrimitives } from '../../domain/types/LicenseKeyPrimitives';
import {
  ActivateLicenseKeyInput,
  IssueLicenseKeyInput,
  LicenseExpiryAlertConfig,
  LicenseHistoryEntry,
  LicenseKeySearchFilters,
  RenewLicenseKeyInput,
  RevokeLicenseKeyInput,
  ValidateTenantOperationInput,
} from '../../domain/ports/types/LicenseKey';
import { ActivateLicenseHandler } from '../features/license/handlers/activate-license.handler';
import { CanTenantOperateHandler } from '../features/license/handlers/can-tenant-operate.handler';
import { GetActiveLicenseByTenantIdHandler } from '../features/license/handlers/get-active-license-by-tenant-id.handler';
import { GetLicenseByIdHandler } from '../features/license/handlers/get-license-by-id.handler';
import { GetLicenseHistoryHandler } from '../features/license/handlers/get-license-history.handler';
import { HasActiveLicenseHandler } from '../features/license/handlers/has-active-license.handler';
import { IssueLicenseHandler } from '../features/license/handlers/issue-license.handler';
import { ListExpiringLicensesHandler } from '../features/license/handlers/list-expiring-licenses.handler';
import { ListLicensesHandler } from '../features/license/handlers/list-licenses.handler';
import { RenewLicenseHandler } from '../features/license/handlers/renew-license.handler';
import { RevokeLicenseHandler } from '../features/license/handlers/revoke-license.handler';
import { ValidateTenantOperationHandler } from '../features/license/handlers/validate-tenant-operation.handler';

/**
 * Implementación concreta de {@link LicenseAppService}.
 *
 * Actúa como fachada estable para infraestructura, delegando a handlers CQRS
 * (commands/queries) de la capa de aplicación.
 */
export class LicenseApplicationService implements LicenseAppService {
  constructor(
    private readonly issueLicenseHandler: IssueLicenseHandler,
    private readonly activateLicenseHandler: ActivateLicenseHandler,
    private readonly renewLicenseHandler: RenewLicenseHandler,
    private readonly revokeLicenseHandler: RevokeLicenseHandler,
    private readonly getLicenseByIdHandler: GetLicenseByIdHandler,
    private readonly listLicensesHandler: ListLicensesHandler,
    private readonly listExpiringLicensesHandler: ListExpiringLicensesHandler,
    private readonly getActiveLicenseByTenantIdHandler: GetActiveLicenseByTenantIdHandler,
    private readonly hasActiveLicenseHandler: HasActiveLicenseHandler,
    private readonly validateTenantOperationHandler: ValidateTenantOperationHandler,
    private readonly canTenantOperateHandler: CanTenantOperateHandler,
    private readonly getLicenseHistoryHandler: GetLicenseHistoryHandler,
  ) {}

  issue(input: IssueLicenseKeyInput): Promise<LicenseKeyPrimitives> {
    return this.issueLicenseHandler.execute(input);
  }

  activate(licenseKeyId: string, input: ActivateLicenseKeyInput): Promise<LicenseKeyPrimitives> {
    return this.activateLicenseHandler.execute({ licenseKeyId, input });
  }

  renew(licenseKeyId: string, input: RenewLicenseKeyInput): Promise<LicenseKeyPrimitives> {
    return this.renewLicenseHandler.execute({ licenseKeyId, input });
  }

  revoke(licenseKeyId: string, input: RevokeLicenseKeyInput): Promise<LicenseKeyPrimitives> {
    return this.revokeLicenseHandler.execute({ licenseKeyId, input });
  }

  getById(licenseKeyId: string): Promise<LicenseKeyPrimitives> {
    return this.getLicenseByIdHandler.execute({ licenseKeyId });
  }

  list(filters?: LicenseKeySearchFilters): Promise<LicenseKeyPrimitives[]> {
    return this.listLicensesHandler.execute(filters);
  }

  listExpiring(config: LicenseExpiryAlertConfig): Promise<LicenseKeyPrimitives[]> {
    return this.listExpiringLicensesHandler.execute(config);
  }

  getActiveByTenantId(tenantId: string, asOf?: Date): Promise<LicenseKeyPrimitives> {
    return this.getActiveLicenseByTenantIdHandler.execute({ tenantId, asOf });
  }

  hasActiveLicense(tenantId: string, asOf?: Date): Promise<boolean> {
    return this.hasActiveLicenseHandler.execute({ tenantId, asOf });
  }

  validateTenantOperation(tenantId: string, input?: ValidateTenantOperationInput): Promise<void> {
    return this.validateTenantOperationHandler.execute({ tenantId, input });
  }

  canTenantOperate(tenantId: string, input?: ValidateTenantOperationInput): Promise<boolean> {
    return this.canTenantOperateHandler.execute({ tenantId, input });
  }

  getHistoryByLicenseKeyId(licenseKeyId: string): Promise<LicenseHistoryEntry[]> {
    return this.getLicenseHistoryHandler.execute({ licenseKeyId });
  }
}

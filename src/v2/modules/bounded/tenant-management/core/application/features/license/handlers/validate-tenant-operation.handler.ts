import { LicenseKeyService } from '../../../../domain/ports/inbound/license-key-service.port';
import { ValidateTenantOperationCommand } from '../commands/validate-tenant-operation.command';

export class ValidateTenantOperationHandler {
  constructor(private readonly licenseKeyService: LicenseKeyService) {}

  execute(command: ValidateTenantOperationCommand): Promise<void> {
    return this.licenseKeyService.validateTenantOperation(command.tenantId, command.input);
  }
}

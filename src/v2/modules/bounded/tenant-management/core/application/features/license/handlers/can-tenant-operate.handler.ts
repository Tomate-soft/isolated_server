import { LicenseKeyService } from '../../../../domain/ports/inbound/license-key-service.port';
import { ValidateTenantOperationCommand } from '../commands/validate-tenant-operation.command';

export class CanTenantOperateHandler {
  constructor(private readonly licenseKeyService: LicenseKeyService) {}

  execute(command: ValidateTenantOperationCommand): Promise<boolean> {
    return this.licenseKeyService.canTenantOperate(command.tenantId, command.input);
  }
}

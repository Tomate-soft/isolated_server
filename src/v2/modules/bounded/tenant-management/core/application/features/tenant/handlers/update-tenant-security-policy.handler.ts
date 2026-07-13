import { TenantPrimitives } from '../../../../domain/types/TenantPrimitives';
import { TenantService } from '../../../../domain/ports/inbound/tenant-service.port';
import { UpdateTenantSecurityPolicyCommand } from '../commands/update-tenant-security-policy.command';

export class UpdateTenantSecurityPolicyHandler {
  constructor(private readonly tenantService: TenantService) {}

  execute(command: UpdateTenantSecurityPolicyCommand): Promise<TenantPrimitives> {
    return this.tenantService.updateSecurityPolicy(command.tenantId, command.input);
  }
}

import { TenantPrimitives } from '../../../../domain/types/TenantPrimitives';
import { TenantService } from '../../../../domain/ports/inbound/tenant-service.port';
import { ActivateTenantCommand } from '../commands/activate-tenant.command';

export class ActivateTenantHandler {
  constructor(private readonly tenantService: TenantService) {}

  execute(command: ActivateTenantCommand): Promise<TenantPrimitives> {
    return this.tenantService.activate(command.tenantId, command.updatedAt);
  }
}

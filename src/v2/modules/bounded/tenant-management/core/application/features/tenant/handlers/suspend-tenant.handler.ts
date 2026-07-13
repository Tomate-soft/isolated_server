import { TenantPrimitives } from '../../../../domain/types/TenantPrimitives';
import { TenantService } from '../../../../domain/ports/inbound/tenant-service.port';
import { SuspendTenantCommand } from '../commands/suspend-tenant.command';

export class SuspendTenantHandler {
  constructor(private readonly tenantService: TenantService) {}

  execute(command: SuspendTenantCommand): Promise<TenantPrimitives> {
    return this.tenantService.suspend(command.tenantId, command.updatedAt);
  }
}

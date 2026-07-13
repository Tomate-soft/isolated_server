import { TenantPrimitives } from '../../../../domain/types/TenantPrimitives';
import { TenantService } from '../../../../domain/ports/inbound/tenant-service.port';
import { DeleteTenantCommand } from '../commands/delete-tenant.command';

export class DeleteTenantHandler {
  constructor(private readonly tenantService: TenantService) {}

  execute(command: DeleteTenantCommand): Promise<TenantPrimitives> {
    return this.tenantService.delete(command.tenantId, command.updatedAt);
  }
}

import { TenantPrimitives } from '../../../../domain/types/TenantPrimitives';
import { TenantService } from '../../../../domain/ports/inbound/tenant-service.port';
import { CreateTenantCommand } from '../commands/create-tenant.command';

export class CreateTenantHandler {
  constructor(private readonly tenantService: TenantService) {}

  execute(command: CreateTenantCommand): Promise<TenantPrimitives> {
    return this.tenantService.create(command);
  }
}

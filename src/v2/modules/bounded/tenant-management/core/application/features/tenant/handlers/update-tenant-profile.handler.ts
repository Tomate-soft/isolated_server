import { TenantPrimitives } from '../../../../domain/types/TenantPrimitives';
import { TenantService } from '../../../../domain/ports/inbound/tenant-service.port';
import { UpdateTenantProfileCommand } from '../commands/update-tenant-profile.command';

export class UpdateTenantProfileHandler {
  constructor(private readonly tenantService: TenantService) {}

  execute(command: UpdateTenantProfileCommand): Promise<TenantPrimitives> {
    return this.tenantService.updateProfile(command.tenantId, command.input);
  }
}

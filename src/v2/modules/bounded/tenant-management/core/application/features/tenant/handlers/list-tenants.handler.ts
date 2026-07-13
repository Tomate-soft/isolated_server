import { TenantPrimitives } from '../../../../domain/types/TenantPrimitives';
import { TenantService } from '../../../../domain/ports/inbound/tenant-service.port';
import { ListTenantsQuery } from '../queries/list-tenants.query';

export class ListTenantsHandler {
  constructor(private readonly tenantService: TenantService) {}

  execute(_query?: ListTenantsQuery): Promise<TenantPrimitives[]> {
    return this.tenantService.listAll();
  }
}

import { TenantPrimitives } from '../../../../domain/types/TenantPrimitives';
import { TenantService } from '../../../../domain/ports/inbound/tenant-service.port';
import { GetTenantByIdQuery } from '../queries/get-tenant-by-id.query';

export class GetTenantByIdHandler {
  constructor(private readonly tenantService: TenantService) {}

  execute(query: GetTenantByIdQuery): Promise<TenantPrimitives> {
    return this.tenantService.getById(query.tenantId);
  }
}

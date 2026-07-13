import { LicenseKeyPrimitives } from '../../../../domain/types/LicenseKeyPrimitives';
import { LicenseKeyService } from '../../../../domain/ports/inbound/license-key-service.port';
import { GetActiveLicenseByTenantIdQuery } from '../queries/get-active-license-by-tenant-id.query';

export class GetActiveLicenseByTenantIdHandler {
  constructor(private readonly licenseKeyService: LicenseKeyService) {}

  execute(query: GetActiveLicenseByTenantIdQuery): Promise<LicenseKeyPrimitives> {
    return this.licenseKeyService.getActiveByTenantId(query.tenantId, query.asOf);
  }
}

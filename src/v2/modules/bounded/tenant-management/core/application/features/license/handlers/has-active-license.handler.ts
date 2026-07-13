import { LicenseKeyService } from '../../../../domain/ports/inbound/license-key-service.port';
import { HasActiveLicenseQuery } from '../queries/has-active-license.query';

export class HasActiveLicenseHandler {
  constructor(private readonly licenseKeyService: LicenseKeyService) {}

  execute(query: HasActiveLicenseQuery): Promise<boolean> {
    return this.licenseKeyService.hasActiveLicense(query.tenantId, query.asOf);
  }
}

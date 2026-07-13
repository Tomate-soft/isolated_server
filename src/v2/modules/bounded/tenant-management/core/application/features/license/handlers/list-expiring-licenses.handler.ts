import { LicenseKeyPrimitives } from '../../../../domain/types/LicenseKeyPrimitives';
import { LicenseKeyService } from '../../../../domain/ports/inbound/license-key-service.port';
import { ListExpiringLicensesQuery } from '../queries/list-expiring-licenses.query';

export class ListExpiringLicensesHandler {
  constructor(private readonly licenseKeyService: LicenseKeyService) {}

  execute(query: ListExpiringLicensesQuery): Promise<LicenseKeyPrimitives[]> {
    return this.licenseKeyService.listExpiring(query);
  }
}

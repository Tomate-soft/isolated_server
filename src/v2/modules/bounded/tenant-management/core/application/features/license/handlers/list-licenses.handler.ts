import { LicenseKeyPrimitives } from '../../../../domain/types/LicenseKeyPrimitives';
import { LicenseKeyService } from '../../../../domain/ports/inbound/license-key-service.port';
import { ListLicensesQuery } from '../queries/list-licenses.query';

export class ListLicensesHandler {
  constructor(private readonly licenseKeyService: LicenseKeyService) {}

  execute(filters?: ListLicensesQuery): Promise<LicenseKeyPrimitives[]> {
    return this.licenseKeyService.list(filters);
  }
}

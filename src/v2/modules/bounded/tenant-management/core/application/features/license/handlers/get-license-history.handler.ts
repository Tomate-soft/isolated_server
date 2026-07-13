import { LicenseHistoryEntry } from '../../../../domain/ports/types/LicenseKey';
import { LicenseKeyService } from '../../../../domain/ports/inbound/license-key-service.port';
import { GetLicenseHistoryQuery } from '../queries/get-license-history.query';

export class GetLicenseHistoryHandler {
  constructor(private readonly licenseKeyService: LicenseKeyService) {}

  execute(query: GetLicenseHistoryQuery): Promise<LicenseHistoryEntry[]> {
    return this.licenseKeyService.getHistoryByLicenseKeyId(query.licenseKeyId);
  }
}

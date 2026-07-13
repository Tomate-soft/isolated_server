import { LicenseKeyPrimitives } from '../../../../domain/types/LicenseKeyPrimitives';
import { LicenseKeyService } from '../../../../domain/ports/inbound/license-key-service.port';
import { GetLicenseByIdQuery } from '../queries/get-license-by-id.query';

export class GetLicenseByIdHandler {
  constructor(private readonly licenseKeyService: LicenseKeyService) {}

  execute(query: GetLicenseByIdQuery): Promise<LicenseKeyPrimitives> {
    return this.licenseKeyService.getById(query.licenseKeyId);
  }
}

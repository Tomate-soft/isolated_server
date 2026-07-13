import { LicenseKeyPrimitives } from '../../../../domain/types/LicenseKeyPrimitives';
import { LicenseKeyService } from '../../../../domain/ports/inbound/license-key-service.port';
import { RenewLicenseCommand } from '../commands/renew-license.command';

export class RenewLicenseHandler {
  constructor(private readonly licenseKeyService: LicenseKeyService) {}

  execute(command: RenewLicenseCommand): Promise<LicenseKeyPrimitives> {
    return this.licenseKeyService.renew(command.licenseKeyId, command.input);
  }
}

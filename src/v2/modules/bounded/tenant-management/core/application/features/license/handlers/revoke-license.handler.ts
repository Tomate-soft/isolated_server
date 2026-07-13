import { LicenseKeyPrimitives } from '../../../../domain/types/LicenseKeyPrimitives';
import { LicenseKeyService } from '../../../../domain/ports/inbound/license-key-service.port';
import { RevokeLicenseCommand } from '../commands/revoke-license.command';

export class RevokeLicenseHandler {
  constructor(private readonly licenseKeyService: LicenseKeyService) {}

  execute(command: RevokeLicenseCommand): Promise<LicenseKeyPrimitives> {
    return this.licenseKeyService.revoke(command.licenseKeyId, command.input);
  }
}

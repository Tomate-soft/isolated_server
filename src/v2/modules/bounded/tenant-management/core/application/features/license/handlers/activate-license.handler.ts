import { LicenseKeyPrimitives } from '../../../../domain/types/LicenseKeyPrimitives';
import { LicenseKeyService } from '../../../../domain/ports/inbound/license-key-service.port';
import { ActivateLicenseCommand } from '../commands/activate-license.command';

export class ActivateLicenseHandler {
  constructor(private readonly licenseKeyService: LicenseKeyService) {}

  execute(command: ActivateLicenseCommand): Promise<LicenseKeyPrimitives> {
    return this.licenseKeyService.activate(command.licenseKeyId, command.input);
  }
}

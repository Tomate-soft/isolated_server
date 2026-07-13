import { LicenseKeyPrimitives } from '../../../../domain/types/LicenseKeyPrimitives';
import { LicenseKeyService } from '../../../../domain/ports/inbound/license-key-service.port';
import { IssueLicenseCommand } from '../commands/issue-license.command';

export class IssueLicenseHandler {
  constructor(private readonly licenseKeyService: LicenseKeyService) {}

  execute(command: IssueLicenseCommand): Promise<LicenseKeyPrimitives> {
    return this.licenseKeyService.issue(command);
  }
}

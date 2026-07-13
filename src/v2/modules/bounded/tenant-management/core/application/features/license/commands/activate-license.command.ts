import { ActivateLicenseKeyInput } from '../../../../domain/ports/types/LicenseKey';

export interface ActivateLicenseCommand {
  licenseKeyId: string;
  input: ActivateLicenseKeyInput;
}

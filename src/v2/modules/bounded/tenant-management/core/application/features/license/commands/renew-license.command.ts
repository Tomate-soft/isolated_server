import { RenewLicenseKeyInput } from '../../../../domain/ports/types/LicenseKey';

export interface RenewLicenseCommand {
  licenseKeyId: string;
  input: RenewLicenseKeyInput;
}

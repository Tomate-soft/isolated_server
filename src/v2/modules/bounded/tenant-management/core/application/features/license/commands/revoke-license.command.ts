import { RevokeLicenseKeyInput } from '../../../../domain/ports/types/LicenseKey';

export interface RevokeLicenseCommand {
  licenseKeyId: string;
  input: RevokeLicenseKeyInput;
}

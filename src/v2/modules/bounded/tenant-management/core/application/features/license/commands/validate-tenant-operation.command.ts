import { ValidateTenantOperationInput } from '../../../../domain/ports/types/LicenseKey';

export interface ValidateTenantOperationCommand {
  tenantId: string;
  input?: ValidateTenantOperationInput;
}

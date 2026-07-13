import { UpdateTenantSecurityPolicyInput } from '../../../../domain/ports/types/Tenant';

export interface UpdateTenantSecurityPolicyCommand {
  tenantId: string;
  input: UpdateTenantSecurityPolicyInput;
}

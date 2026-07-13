import { UpdateTenantProfileInput } from '../../../../domain/ports/types/Tenant';

export interface UpdateTenantProfileCommand {
  tenantId: string;
  input: UpdateTenantProfileInput;
}

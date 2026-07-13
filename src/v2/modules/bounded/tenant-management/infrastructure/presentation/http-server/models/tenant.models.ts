import { TenantSecurityPolicy } from '../../../../core/domain/types/TenantSecurityPolicy';
import { TenantStatus } from '../../../../core/domain/value-objects/tenant/tenant-status.enum';

export class CreateTenantRequest {
  name!: string;
  legal_name!: string;
  tax_id!: string;
  country_code!: string;
  currency_code!: string;
  timezone!: string;
  securityPolicy?: TenantSecurityPolicy;
  status?: TenantStatus;
}

export class UpdateTenantProfileRequest {
  name?: string;
  legal_name?: string;
  tax_id?: string;
  country_code?: string;
  currency_code?: string;
  timezone?: string;
}

export class UpdateTenantSecurityPolicyRequest {
  passwordPolicy?: TenantSecurityPolicy['passwordPolicy'];
  sessionPolicy?: TenantSecurityPolicy['sessionPolicy'];
}

export class TenantResponse {
  id!: string;
  name!: string;
  legal_name!: string;
  tax_id!: string;
  country_code!: string;
  currency_code!: string;
  timezone!: string;
  security_policy?: TenantSecurityPolicy;
  status!: TenantStatus;
  created_at!: Date;
  updated_at!: Date;
}

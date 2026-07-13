import { TenantSecurityPolicy } from './TenantSecurityPolicy';
import { TenantStatus } from '../value-objects/tenant/tenant-status.enum';

/**
 * Representación plana (solo primitivos) del aggregate `Tenant`.
 *
 * Sirve como contrato de serialización entre capas:
 *   - Input de `TenantEntity.create()`.
 *   - Output de `tenantEntity.toPrimitives()`.
 *   - Tipo de retorno de los Domain Services (nunca exponen entidades al exterior).
 *
 * Al no contener Value Objects ni métodos de dominio, puede cruzar libremente
 * las fronteras de capa sin romper el encapsulamiento.
 */
export interface TenantPrimitives {
  id: string;
  name: string;
  legal_name: string;
  tax_id: string;
  country_code: string;
  currency_code: string;
  timezone: string;
  security_policy?: TenantSecurityPolicy;
  status: TenantStatus;
  created_at: Date;
  updated_at: Date;
}

import { TenantSecurityPolicy } from '../../types/TenantSecurityPolicy';
import { TenantPrimitives } from '../../types/TenantPrimitives';

/**
 * Input para crear un tenant nuevo.
 * No incluye `id` ni `created_at` — los genera el Domain Service.
 */
export interface CreateTenantInput {
  name: string;
  legal_name: string;
  tax_id: string;
  country_code: string;
  currency_code: string;
  timezone: string;
  securityPolicy?: TenantSecurityPolicy;
  /** Permite inyectar un estado inicial distinto de ACTIVE (ej: tests, migraciones). */
  status?: TenantPrimitives['status'];
  /** Permite inyectar una fecha de creación (ej: migraciones de datos). */
  created_at?: Date;
  updated_at?: Date;
}

/**
 * Input para actualizar el perfil configurable de un tenant. RF-01.3
 * Todos los campos son opcionales: solo se actualizan los provistos.
 */
export interface UpdateTenantProfileInput {
  name?: string;
  legal_name?: string;
  tax_id?: string;
  country_code?: string;
  currency_code?: string;
  timezone?: string;
}

/**
 * Input para actualizar la política de seguridad de un tenant. RF-01.5
 * Cada sub-política se fusiona con la existente (merge parcial), no la reemplaza.
 */
export interface UpdateTenantSecurityPolicyInput {
  passwordPolicy?: TenantSecurityPolicy['passwordPolicy'];
  sessionPolicy?: TenantSecurityPolicy['sessionPolicy'];
}

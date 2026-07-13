import { TenantPrimitives } from '../../../domain/types/TenantPrimitives';
import {
  CreateTenantInput,
  UpdateTenantProfileInput,
  UpdateTenantSecurityPolicyInput,
} from '../../../domain/ports/types/Tenant';

/**
 * Contrato de la capa de aplicación para el bounded context `tenant-management`.
 *
 * Orquesta casos de uso y reglas a nivel de aplicación (autorización, transacciones,
 * integración con servicios externos, etc.) sin exponer detalles de infraestructura.
 *
 * La infraestructura (controllers, handlers) debe depender de este contrato,
 * no del dominio directamente.
 */
export interface TenantAppService {
  create(input: CreateTenantInput): Promise<TenantPrimitives>;
  activate(tenantId: string, updatedAt?: Date): Promise<TenantPrimitives>;
  suspend(tenantId: string, updatedAt?: Date): Promise<TenantPrimitives>;
  delete(tenantId: string, updatedAt?: Date): Promise<TenantPrimitives>;
  updateProfile(tenantId: string, input: UpdateTenantProfileInput): Promise<TenantPrimitives>;
  updateSecurityPolicy(
    tenantId: string,
    input: UpdateTenantSecurityPolicyInput,
  ): Promise<TenantPrimitives>;
  getById(tenantId: string): Promise<TenantPrimitives>;
  listAll(): Promise<TenantPrimitives[]>;
}

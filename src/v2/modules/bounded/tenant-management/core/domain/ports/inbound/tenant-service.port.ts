import { TenantPrimitives } from '../../types/TenantPrimitives';
import {
  CreateTenantInput,
  UpdateTenantProfileInput,
  UpdateTenantSecurityPolicyInput,
} from '../types/Tenant';

/**
 * Puerto de entrada (inbound port) del aggregate `Tenant`.
 *
 * Define el contrato que el dominio expone al mundo exterior.
 * La infraestructura (controllers HTTP, gRPC, CLI) invoca estos métodos
 * a través de la inyección de dependencias de NestJS.
 *
 * Implementado por: {@link TenantDomainService}
 *
 * RF-01.1: gestión del ciclo de vida completo del tenant.
 * RF-01.3: actualización de configuración regional.
 * RF-01.5: actualización de política de seguridad.
 */
export interface TenantService {
  /** Crea un nuevo tenant con estado ACTIVE por defecto. */
  create(input: CreateTenantInput): Promise<TenantPrimitives>;

  /** Reactiva un tenant previamente suspendido. */
  activate(tenantId: string, updatedAt?: Date): Promise<TenantPrimitives>;

  /** Bloquea temporalmente el acceso del tenant. */
  suspend(tenantId: string, updatedAt?: Date): Promise<TenantPrimitives>;

  /** Eliminación lógica del tenant (soft-delete). */
  delete(tenantId: string, updatedAt?: Date): Promise<TenantPrimitives>;

  /** Actualiza datos de perfil (nombre, país, moneda, timezone, etc.). */
  updateProfile(tenantId: string, input: UpdateTenantProfileInput): Promise<TenantPrimitives>;

  /** Actualiza la política de contraseñas y/o sesiones del tenant. RF-01.5 */
  updateSecurityPolicy(
    tenantId: string,
    input: UpdateTenantSecurityPolicyInput,
  ): Promise<TenantPrimitives>;

  /** Obtiene un tenant por su ID o lanza error si no existe. */
  getById(tenantId: string): Promise<TenantPrimitives>;

  /** Lista todos los tenants sin filtro (uso superadmin). RF-01.4 */
  listAll(): Promise<TenantPrimitives[]>;
}

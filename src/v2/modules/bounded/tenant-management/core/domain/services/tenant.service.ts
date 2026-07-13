import { randomUUID } from 'crypto';
import { TenantEntity } from '../entities/tenant.entity';
import { TenantRepository } from '../ports/outbound/tenant-repository.port';
import { TenantPrimitives } from '../types/TenantPrimitives';
import { TenantStatus } from '../value-objects/tenant/tenant-status.enum';
import {
  CreateTenantInput,
  UpdateTenantProfileInput,
  UpdateTenantSecurityPolicyInput,
} from '../ports/types/Tenant';
import { TenantService } from '../ports/inbound/tenant-service.port';
import { EntityNotFoundException } from '../exceptions/entity/entity-not-found.exception';

/**
 * Implementación del inbound port {@link TenantService}.
 *
 * Coordina las operaciones de negocio sobre el aggregate `Tenant`:
 *   - Crea y muta entidades a través de sus métodos de dominio.
 *   - Persiste usando el outbound port {@link TenantRepository}.
 *   - Devuelve siempre primitives (nunca entidades) al exterior.
 *
 * No conoce ni depende de NestJS, MongoDB, HTTP ni ninguna tecnología concreta.
 * Es registrado como provider en `CoreModule` e inyectado en los controllers
 * de infraestructura usando el token del inbound port.
 */
export class TenantDomainService implements TenantService {
  constructor(private readonly tenantRepository: TenantRepository) {}

  // ─── Comandos ─────────────────────────────────────────────────────────────────

  /** Crea un nuevo tenant y lo persiste con status ACTIVE por defecto. */

  async create(input: CreateTenantInput): Promise<TenantPrimitives> {
    const now = input.created_at ?? new Date();
    const tenant = TenantEntity.create({
      id: randomUUID(),
      name: input.name,
      legal_name: input.legal_name,
      tax_id: input.tax_id,
      country_code: input.country_code,
      currency_code: input.currency_code,
      timezone: input.timezone,
      security_policy: input.securityPolicy,
      status: input.status ?? TenantStatus.ACTIVE,
      created_at: now,
      updated_at: input.updated_at ?? now,
    });

    const savedTenant = await this.tenantRepository.save(tenant);
    return savedTenant.toPrimitives();
  }

  async activate(tenantId: string, updatedAt?: Date): Promise<TenantPrimitives> {
    const tenant = await this.getEntityOrFail(tenantId);
    tenant.activate(updatedAt ?? new Date());
    return (await this.tenantRepository.save(tenant)).toPrimitives();
  }

  async suspend(tenantId: string, updatedAt?: Date): Promise<TenantPrimitives> {
    const tenant = await this.getEntityOrFail(tenantId);
    tenant.suspend(updatedAt ?? new Date());
    return (await this.tenantRepository.save(tenant)).toPrimitives();
  }

  async delete(tenantId: string, updatedAt?: Date): Promise<TenantPrimitives> {
    const tenant = await this.getEntityOrFail(tenantId);
    tenant.delete(updatedAt ?? new Date());
    return (await this.tenantRepository.save(tenant)).toPrimitives();
  }

  async updateProfile(
    tenantId: string,
    input: UpdateTenantProfileInput,
  ): Promise<TenantPrimitives> {
    const tenant = await this.getEntityOrFail(tenantId);
    tenant.updateProfile(input);
    return (await this.tenantRepository.save(tenant)).toPrimitives();
  }

  async updateSecurityPolicy(
    tenantId: string,
    input: UpdateTenantSecurityPolicyInput,
  ): Promise<TenantPrimitives> {
    const tenant = await this.getEntityOrFail(tenantId);
    tenant.updateSecurityPolicy(input);
    return (await this.tenantRepository.save(tenant)).toPrimitives();
  }

  async getById(tenantId: string): Promise<TenantPrimitives> {
    return (await this.getEntityOrFail(tenantId)).toPrimitives();
  }

  async listAll(): Promise<TenantPrimitives[]> {
    const tenants = await this.tenantRepository.findAll();
    return tenants.map((tenant) => tenant.toPrimitives());
  }

  private async getEntityOrFail(tenantId: string): Promise<TenantEntity> {
    const tenant = await this.tenantRepository.findById(tenantId);

    if (!tenant) {
      throw new EntityNotFoundException(`Tenant not found: ${tenantId}`);
    }

    return tenant;
  }
}

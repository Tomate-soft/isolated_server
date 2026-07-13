import { TenantAppService } from '../ports/inbound/tenant-app-service.port';
import { TenantPrimitives } from '../../domain/types/TenantPrimitives';
import {
  CreateTenantInput,
  UpdateTenantProfileInput,
  UpdateTenantSecurityPolicyInput,
} from '../../domain/ports/types/Tenant';
import { ActivateTenantHandler } from '../features/tenant/handlers/activate-tenant.handler';
import { CreateTenantHandler } from '../features/tenant/handlers/create-tenant.handler';
import { DeleteTenantHandler } from '../features/tenant/handlers/delete-tenant.handler';
import { GetTenantByIdHandler } from '../features/tenant/handlers/get-tenant-by-id.handler';
import { ListTenantsHandler } from '../features/tenant/handlers/list-tenants.handler';
import { SuspendTenantHandler } from '../features/tenant/handlers/suspend-tenant.handler';
import { UpdateTenantProfileHandler } from '../features/tenant/handlers/update-tenant-profile.handler';
import { UpdateTenantSecurityPolicyHandler } from '../features/tenant/handlers/update-tenant-security-policy.handler';

/**
 * Implementación concreta de {@link TenantAppService}.
 *
 * Actúa como fachada estable para infraestructura, delegando a handlers CQRS
 * (commands/queries) de la capa de aplicación.
 */
export class TenantApplicationService implements TenantAppService {
  constructor(
    private readonly createTenantHandler: CreateTenantHandler,
    private readonly activateTenantHandler: ActivateTenantHandler,
    private readonly suspendTenantHandler: SuspendTenantHandler,
    private readonly deleteTenantHandler: DeleteTenantHandler,
    private readonly updateTenantProfileHandler: UpdateTenantProfileHandler,
    private readonly updateTenantSecurityPolicyHandler: UpdateTenantSecurityPolicyHandler,
    private readonly getTenantByIdHandler: GetTenantByIdHandler,
    private readonly listTenantsHandler: ListTenantsHandler,
  ) {}

  create(input: CreateTenantInput): Promise<TenantPrimitives> {
    return this.createTenantHandler.execute(input);
  }

  activate(tenantId: string, updatedAt?: Date): Promise<TenantPrimitives> {
    return this.activateTenantHandler.execute({ tenantId, updatedAt });
  }

  suspend(tenantId: string, updatedAt?: Date): Promise<TenantPrimitives> {
    return this.suspendTenantHandler.execute({ tenantId, updatedAt });
  }

  delete(tenantId: string, updatedAt?: Date): Promise<TenantPrimitives> {
    return this.deleteTenantHandler.execute({ tenantId, updatedAt });
  }

  updateProfile(tenantId: string, input: UpdateTenantProfileInput): Promise<TenantPrimitives> {
    return this.updateTenantProfileHandler.execute({ tenantId, input });
  }

  updateSecurityPolicy(
    tenantId: string,
    input: UpdateTenantSecurityPolicyInput,
  ): Promise<TenantPrimitives> {
    return this.updateTenantSecurityPolicyHandler.execute({ tenantId, input });
  }

  getById(tenantId: string): Promise<TenantPrimitives> {
    return this.getTenantByIdHandler.execute({ tenantId });
  }

  listAll(): Promise<TenantPrimitives[]> {
    return this.listTenantsHandler.execute();
  }
}

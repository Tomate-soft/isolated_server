import { TenantEntity } from '../../entities/tenant.entity';
import { TenantStatus } from '../../value-objects/tenant/tenant-status.enum';

/**
 * Puerto de salida (outbound port) del aggregate `Tenant`.
 *
 * Define el contrato de persistencia que el dominio requiere del mundo exterior.
 * La infraestructura implementa este port (ej: `MongoTenantRepository`).
 * El dominio solo conoce la interfaz, nunca la implementación.
 *
 * Patrón: todas las operaciones de escritura usan `save()` (upsert semántico),
 * siguiendo el patrón Repository de DDD para evitar métodos `update` separados.
 */
export interface TenantRepository {
  /**
   * Persiste un tenant (insert si es nuevo, update si ya existe).
   * Devuelve la entidad tal como quedó guardada.
   */
  save(tenant: TenantEntity): Promise<TenantEntity>;

  /** Busca un tenant por ID. Devuelve `null` si no existe. */
  findById(tenantId: string): Promise<TenantEntity | null>;

  /** Devuelve todos los tenants sin filtro (uso superadmin). */
  findAll(): Promise<TenantEntity[]>;

  /** Filtra tenants por estado (ej: listar solo los ACTIVE). */
  findByStatus(status: TenantStatus): Promise<TenantEntity[]>;

  /** Verifica existencia sin cargar la entidad completa. */
  existsById(tenantId: string): Promise<boolean>;

  /** Elimina físicamente un tenant de la base de datos (uso interno/tests). */
  deleteById(tenantId: string): Promise<void>;
}

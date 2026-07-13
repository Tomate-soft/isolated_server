import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TenantEntity } from '../../../../core/domain/entities/tenant.entity';
import { TenantRepository } from '../../../../core/domain/ports/outbound/tenant-repository.port';
import { TenantStatus } from '../../../../core/domain/value-objects/tenant/tenant-status.enum';
import { TenantOrmEntity } from '../../../persistence/postgres/entities/tenant.orm-entity';

@Injectable()
export class PostgresTenantRepository implements TenantRepository {
  constructor(
    @InjectRepository(TenantOrmEntity)
    private readonly ormRepo: Repository<TenantOrmEntity>,
  ) {}

  async save(tenant: TenantEntity): Promise<TenantEntity> {
    const primitives = tenant.toPrimitives();

    const toSave: TenantOrmEntity = {
      id: primitives.id,
      name: primitives.name,
      legal_name: primitives.legal_name,
      tax_id: primitives.tax_id,
      country_code: primitives.country_code,
      currency_code: primitives.currency_code,
      timezone: primitives.timezone,
      security_policy: primitives.security_policy,
      status: primitives.status,
      created_at: primitives.created_at,
      updated_at: primitives.updated_at,
    };

    const saved = await this.ormRepo.save(toSave);

    return TenantEntity.create({
      id: saved.id,
      name: saved.name,
      legal_name: saved.legal_name,
      tax_id: saved.tax_id,
      country_code: saved.country_code,
      currency_code: saved.currency_code,
      timezone: saved.timezone,
      security_policy: saved.security_policy,
      status: saved.status,
      created_at: saved.created_at,
      updated_at: saved.updated_at,
    });
  }

  async findById(tenantId: string): Promise<TenantEntity | null> {
    const row = await this.ormRepo.findOne({ where: { id: tenantId } });
    if (!row) return null;

    return TenantEntity.create({
      id: row.id,
      name: row.name,
      legal_name: row.legal_name,
      tax_id: row.tax_id,
      country_code: row.country_code,
      currency_code: row.currency_code,
      timezone: row.timezone,
      security_policy: row.security_policy,
      status: row.status,
      created_at: row.created_at,
      updated_at: row.updated_at,
    });
  }

  async findAll(): Promise<TenantEntity[]> {
    const rows = await this.ormRepo.find();
    return rows.map((row) =>
      TenantEntity.create({
        id: row.id,
        name: row.name,
        legal_name: row.legal_name,
        tax_id: row.tax_id,
        country_code: row.country_code,
        currency_code: row.currency_code,
        timezone: row.timezone,
        security_policy: row.security_policy,
        status: row.status,
        created_at: row.created_at,
        updated_at: row.updated_at,
      }),
    );
  }

  async findByStatus(status: TenantStatus): Promise<TenantEntity[]> {
    const rows = await this.ormRepo.find({ where: { status } });
    return rows.map((row) =>
      TenantEntity.create({
        id: row.id,
        name: row.name,
        legal_name: row.legal_name,
        tax_id: row.tax_id,
        country_code: row.country_code,
        currency_code: row.currency_code,
        timezone: row.timezone,
        security_policy: row.security_policy,
        status: row.status,
        created_at: row.created_at,
        updated_at: row.updated_at,
      }),
    );
  }

  async existsById(tenantId: string): Promise<boolean> {
    return this.ormRepo.exists({ where: { id: tenantId } });
  }

  async deleteById(tenantId: string): Promise<void> {
    await this.ormRepo.delete({ id: tenantId });
  }
}

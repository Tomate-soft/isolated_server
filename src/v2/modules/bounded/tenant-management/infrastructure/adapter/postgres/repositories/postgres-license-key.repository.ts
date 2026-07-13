import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LicenseKeyEntity } from '../../../../core/domain/entities/LicenseKeyEntity';
import { LicenseKeyRepository } from '../../../../core/domain/ports/outbound/license-key-repository.port';
import {
  LicenseExpiryAlertConfig,
  LicenseHistoryEntry,
  LicenseKeySearchFilters,
} from '../../../../core/domain/ports/types/LicenseKey';
import { LicenseKeyPrimitives } from '../../../../core/domain/types/LicenseKeyPrimitives';
import { LicenseAuditPublisher } from '../../events/license-audit.publisher';
import { LicenseKeyOrmEntity } from '../../../persistence/postgres/entities/license-key.orm-entity';

@Injectable()
export class PostgresLicenseKeyRepository implements LicenseKeyRepository {
  constructor(
    @InjectRepository(LicenseKeyOrmEntity)
    private readonly ormRepo: Repository<LicenseKeyOrmEntity>,
    private readonly auditPublisher: LicenseAuditPublisher,
  ) {}

  async save(licenseKey: LicenseKeyEntity): Promise<LicenseKeyEntity> {
    const p = licenseKey.toPrimitives();

    const toSave: LicenseKeyOrmEntity = {
      id: p.id,
      tenantId: p.tenantId,
      licenseKey: p.licenseKey,
      planType: p.planType,
      maxBranches: p.maxBranches,
      maxUsers: p.maxUsers,
      featuresEnabled: p.featuresEnabled ?? {},
      validFrom: new Date(p.validFrom),
      validUntil: new Date(p.validUntil),
      graceDays: p.graceDays ?? 0,
      signatureHash: p.signatureHash,
      issuedBy: p.issuedBy,
      status: p.status,
      activatedAt: p.activatedAt ? new Date(p.activatedAt) : undefined,
      revokedAt: p.revokedAt ? new Date(p.revokedAt) : undefined,
      revocationReason: p.revocationReason,
      createdAt: p.createdAt ? new Date(p.createdAt) : new Date(),
      updatedAt: p.updatedAt ? new Date(p.updatedAt) : new Date(),
    };

    const saved = await this.ormRepo.save(toSave);
    return LicenseKeyEntity.create(this.toPrimitives(saved));
  }

  async findById(licenseKeyId: string): Promise<LicenseKeyEntity | null> {
    const row = await this.ormRepo.findOne({ where: { id: licenseKeyId } });
    return row ? LicenseKeyEntity.create(this.toPrimitives(row)) : null;
  }

  async findAll(filters?: LicenseKeySearchFilters): Promise<LicenseKeyEntity[]> {
    const qb = this.ormRepo.createQueryBuilder('lk');

    if (filters?.tenantId) qb.andWhere('lk.tenantId = :tenantId', { tenantId: filters.tenantId });
    if (filters?.planType) qb.andWhere('lk.planType = :planType', { planType: filters.planType });
    if (filters?.status) qb.andWhere('lk.status = :status', { status: filters.status });

    if (filters?.expiringWithinDays !== undefined) {
      const asOf = filters.asOf ?? new Date();
      const until = new Date(asOf);
      until.setDate(until.getDate() + filters.expiringWithinDays);
      qb.andWhere('lk.validUntil >= :asOf AND lk.validUntil <= :until', { asOf, until });
    }

    const rows = await qb.getMany();
    return rows.map((r) => LicenseKeyEntity.create(this.toPrimitives(r)));
  }

  async findActiveByTenantId(
    tenantId: string,
    asOf: Date = new Date(),
  ): Promise<LicenseKeyEntity | null> {
    // ACTIVE && validFrom <= asOf && (validUntil + graceDays) >= asOf
    const row = await this.ormRepo
      .createQueryBuilder('lk')
      .where('lk.tenantId = :tenantId', { tenantId })
      .andWhere('lk.status = :status', { status: 'ACTIVE' })
      .andWhere('lk.validFrom <= :asOf', { asOf })
      .andWhere(`(lk.validUntil + (lk."graceDays" || ' days')::interval) >= :asOf`, { asOf })
      .orderBy('lk.validUntil', 'DESC')
      .getOne();

    return row ? LicenseKeyEntity.create(this.toPrimitives(row)) : null;
  }

  async findExpiring(config: LicenseExpiryAlertConfig): Promise<LicenseKeyEntity[]> {
    const asOf = config.asOf ?? new Date();
    const until = new Date(asOf);
    until.setDate(until.getDate() + config.daysBeforeExpiration);

    const rows = await this.ormRepo
      .createQueryBuilder('lk')
      .where('lk.validUntil >= :asOf AND lk.validUntil <= :until', { asOf, until })
      .orderBy('lk.validUntil', 'ASC')
      .getMany();

    return rows.map((r) => LicenseKeyEntity.create(this.toPrimitives(r)));
  }

  async existsActiveByTenantId(tenantId: string, asOf: Date = new Date()): Promise<boolean> {
    const count = await this.ormRepo
      .createQueryBuilder('lk')
      .where('lk.tenantId = :tenantId', { tenantId })
      .andWhere('lk.status = :status', { status: 'ACTIVE' })
      .andWhere('lk.validFrom <= :asOf', { asOf })
      .andWhere(`(lk.validUntil + (lk."graceDays" || ' days')::interval) >= :asOf`, { asOf })
      .getCount();

    return count > 0;
  }

  async saveHistory(entry: LicenseHistoryEntry): Promise<LicenseHistoryEntry> {
    // No persistimos aquí. Publicamos evento para el futuro contexto de auditoría.
    this.auditPublisher.publish(entry);
    return entry;
  }

  async findHistoryByLicenseKeyId(_licenseKeyId: string): Promise<LicenseHistoryEntry[]> {
    // El historial pertenece al futuro contexto de auditoría.
    return [];
  }

  async markAsExpired(licenseKeyId: string, expiredAt: Date = new Date()): Promise<void> {
    await this.ormRepo.update({ id: licenseKeyId }, { status: 'EXPIRED', updatedAt: expiredAt });
  }

  async revoke(licenseKeyId: string, revokedAt: Date, reason: string): Promise<void> {
    await this.ormRepo.update(
      { id: licenseKeyId },
      {
        status: 'REVOKED',
        revokedAt,
        revocationReason: reason,
        updatedAt: revokedAt,
      },
    );
  }

  async findCurrentSnapshotByTenantId(
    tenantId: string,
    asOf: Date = new Date(),
  ): Promise<LicenseKeyPrimitives | null> {
    const active = await this.findActiveByTenantId(tenantId, asOf);
    return active ? active.toPrimitives() : null;
  }

  private toPrimitives(row: LicenseKeyOrmEntity): LicenseKeyPrimitives {
    return {
      id: row.id,
      tenantId: row.tenantId,
      licenseKey: row.licenseKey,
      planType: row.planType,
      maxBranches: row.maxBranches,
      maxUsers: row.maxUsers,
      featuresEnabled: row.featuresEnabled,
      validFrom: row.validFrom.toISOString(),
      validUntil: row.validUntil.toISOString(),
      graceDays: row.graceDays,
      signatureHash: row.signatureHash,
      issuedBy: row.issuedBy,
      status: row.status,
      activatedAt: row.activatedAt?.toISOString(),
      revokedAt: row.revokedAt?.toISOString(),
      revocationReason: row.revocationReason,
      createdAt: row.createdAt?.toISOString(),
      updatedAt: row.updatedAt?.toISOString(),
    };
  }
}

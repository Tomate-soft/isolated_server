import { Column, CreateDateColumn, Entity, Index, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { TenantStatus } from '../../../../core/domain/value-objects/tenant/tenant-status.enum';
import { TenantSecurityPolicy } from '../../../../core/domain/types/TenantSecurityPolicy';

@Entity({ name: 'tenants' })
export class TenantOrmEntity {
  @PrimaryColumn({ type: 'uuid' })
  id!: string;

  @Index()
  @Column({ type: 'varchar', length: 150 })
  name!: string;

  @Column({ type: 'varchar', length: 200 })
  legal_name!: string;

  @Index()
  @Column({ type: 'varchar', length: 50 })
  tax_id!: string;

  @Column({ type: 'varchar', length: 2 })
  country_code!: string;

  @Column({ type: 'varchar', length: 3 })
  currency_code!: string;

  @Column({ type: 'varchar', length: 60 })
  timezone!: string;

  @Column({ type: 'jsonb', nullable: true })
  security_policy?: TenantSecurityPolicy;

  @Index()
  @Column({ type: 'enum', enum: TenantStatus, default: TenantStatus.ACTIVE })
  status!: TenantStatus;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at!: Date;
}

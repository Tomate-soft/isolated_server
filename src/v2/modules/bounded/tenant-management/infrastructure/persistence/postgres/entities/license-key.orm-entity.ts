import { Column, CreateDateColumn, Entity, Index, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'license_keys' })
export class LicenseKeyOrmEntity {
  @PrimaryColumn({ type: 'uuid' })
  id!: string;

  @Index()
  @Column({ type: 'uuid' })
  tenantId!: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 128 })
  licenseKey!: string;

  @Index()
  @Column({ type: 'varchar', length: 32 })
  planType!: string;

  @Column({ type: 'int' })
  maxBranches!: number;

  @Column({ type: 'int' })
  maxUsers!: number;

  @Column({ type: 'jsonb', nullable: true })
  featuresEnabled?: Record<string, unknown>;

  @Column({ type: 'timestamptz' })
  validFrom!: Date;

  @Index()
  @Column({ type: 'timestamptz' })
  validUntil!: Date;

  @Column({ type: 'int', default: 0 })
  graceDays!: number;

  @Column({ type: 'varchar', length: 256 })
  signatureHash!: string;

  @Column({ type: 'varchar', length: 120 })
  issuedBy!: string;

  @Index()
  @Column({ type: 'varchar', length: 24 })
  status!: string;

  @Column({ type: 'timestamptz', nullable: true })
  activatedAt?: Date;

  @Column({ type: 'timestamptz', nullable: true })
  revokedAt?: Date;

  @Column({ type: 'varchar', length: 300, nullable: true })
  revocationReason?: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;
}

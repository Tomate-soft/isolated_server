import { LicenseKeyId } from '../value-objects/license-keys/license-key-id.vo';
import { TenantId } from '../value-objects/license-keys/tenant-id.vo';
import { LicenseKeyValue } from '../value-objects/license-keys/license-key-value.vo';
import { PlanType } from '../value-objects/license-keys/plan-type.vo';
import { LicenseStatus } from '../value-objects/license-keys/license-status.vo';
import { LicenseKeyPrimitives } from '../types/LicenseKeyPrimitives';

export class LicenseKeyEntity {
  private constructor(
    private readonly id: LicenseKeyId,
    private readonly tenantId: TenantId,
    private licenseKey: LicenseKeyValue,
    private planType: PlanType,
    private maxBranches: number,
    private maxUsers: number,
    private featuresEnabled: any,
    private validFrom: Date,
    private validUntil: Date,
    private graceDays: number,
    private signatureHash: string,
    private issuedBy: string,
    private status: LicenseStatus,
    private activatedAt?: Date,
    private revokedAt?: Date,
    private revocationReason?: string,
    private createdAt?: Date,
    private updatedAt?: Date,
  ) {}

  static create(params: LicenseKeyPrimitives): LicenseKeyEntity {
    const id = new LicenseKeyId(params.id);
    const tenantId = new TenantId(params.tenantId);
    const licenseKey = new LicenseKeyValue(params.licenseKey);
    const planType = PlanType.create(params.planType);
    const status = LicenseStatus.create(params.status);
    const now = new Date();

    const entity = new LicenseKeyEntity(
      id,
      tenantId,
      licenseKey,
      planType,
      params.maxBranches,
      params.maxUsers,
      params.featuresEnabled ?? {},
      new Date(params.validFrom),
      new Date(params.validUntil),
      params.graceDays,
      params.signatureHash,
      params.issuedBy,
      status,
      params.activatedAt ? new Date(params.activatedAt) : undefined,
      params.revokedAt ? new Date(params.revokedAt) : undefined,
      params.revocationReason,
      params.createdAt ? new Date(params.createdAt) : now,
      params.updatedAt ? new Date(params.updatedAt) : now,
    );

    return entity;
  }

  // ─── Estado ──────────────────────────────────────────────────────────────────

  /**
   * La licencia está activa si su status es ACTIVE y la fecha asOf
   * está dentro del período de validez (incluyendo grace period).
   * RF-02.1 / RF-02.8
   */
  isActive(asOf: Date = new Date()): boolean {
    if (this.status.getValue() !== 'ACTIVE') return false;
    return asOf >= this.validFrom && !this.isExpiredWithGrace(asOf);
  }

  /**
   * La licencia ha expirado sin contar el grace period.
   */
  isExpired(asOf: Date = new Date()): boolean {
    return asOf > this.validUntil;
  }

  /**
   * La licencia ha expirado incluso contando el grace period.
   * RF-02.8
   */
  isExpiredWithGrace(asOf: Date = new Date()): boolean {
    const graceEnd = new Date(this.validUntil);
    graceEnd.setDate(graceEnd.getDate() + (this.graceDays ?? 0));
    return asOf > graceEnd;
  }

  /**
   * Días restantes hasta la expiración (sin grace). Negativo si ya expiró.
   */
  daysUntilExpiration(asOf: Date = new Date()): number {
    const diffMs = this.validUntil.getTime() - asOf.getTime();
    return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  }

  // ─── Validación de límites (RF-02.3) ─────────────────────────────────────────

  exceedsBranchLimit(requiredBranches: number): boolean {
    return requiredBranches > this.maxBranches;
  }

  exceedsUserLimit(requiredUsers: number): boolean {
    return requiredUsers > this.maxUsers;
  }

  hasFeature(feature: string): boolean {
    if (!this.featuresEnabled) return false;
    return Boolean(this.featuresEnabled[feature]);
  }

  // ─── Comandos de negocio ──────────────────────────────────────────────────────

  suspend(updatedAt: Date): void {
    this.status = LicenseStatus.create('SUSPENDED');
    this.updatedAt = updatedAt;
  }

  activate(activatedAt: Date): void {
    this.status = LicenseStatus.create('ACTIVE');
    this.activatedAt = activatedAt;
    this.updatedAt = activatedAt;
  }

  /**
   * Renueva la licencia actualizando período de vigencia y opcionalmente el plan.
   * RF-02 (renovación)
   */
  renew(params: {
    validFrom?: Date;
    validUntil: Date;
    planType?: string;
    maxBranches?: number;
    maxUsers?: number;
    featuresEnabled?: Record<string, unknown>;
    graceDays?: number;
    signatureHash: string;
    issuedBy: string;
    updatedAt: Date;
  }): void {
    if (params.planType !== undefined) {
      this.planType = PlanType.create(params.planType);
    }
    if (params.maxBranches !== undefined) this.maxBranches = params.maxBranches;
    if (params.maxUsers !== undefined) this.maxUsers = params.maxUsers;
    if (params.featuresEnabled !== undefined) this.featuresEnabled = params.featuresEnabled;
    if (params.graceDays !== undefined) this.graceDays = params.graceDays;

    this.validFrom = params.validFrom ?? this.validFrom;
    this.validUntil = params.validUntil;
    this.signatureHash = params.signatureHash;
    this.issuedBy = params.issuedBy;
    this.status = LicenseStatus.create('ACTIVE');
    this.updatedAt = params.updatedAt;
  }

  /**
   * Revoca la licencia de forma inmediata. RF-02.6
   */
  revoke(params: { revokedAt: Date; revocationReason: string }): void {
    this.status = LicenseStatus.create('REVOKED');
    this.revokedAt = params.revokedAt;
    this.revocationReason = params.revocationReason;
    this.updatedAt = params.revokedAt;
  }

  /**
   * Marca la licencia como expirada (usado por el proceso automático). RF-02.5
   */
  expire(expiredAt: Date): void {
    this.status = LicenseStatus.create('EXPIRED');
    this.updatedAt = expiredAt;
  }

  // ─── Proyección ───────────────────────────────────────────────────────────────

  toPrimitives(): LicenseKeyPrimitives {
    return {
      id: this.id.getValue(),
      tenantId: this.tenantId.getValue(),
      licenseKey: this.licenseKey.getValue(),
      planType: this.planType.getValue(),
      maxBranches: this.maxBranches,
      maxUsers: this.maxUsers,
      featuresEnabled: this.featuresEnabled,
      validFrom: this.validFrom.toISOString(),
      validUntil: this.validUntil.toISOString(),
      graceDays: this.graceDays,
      signatureHash: this.signatureHash,
      issuedBy: this.issuedBy,
      status: this.status.getValue(),
      activatedAt: this.activatedAt?.toISOString(),
      revokedAt: this.revokedAt?.toISOString(),
      revocationReason: this.revocationReason,
      createdAt: this.createdAt?.toISOString(),
      updatedAt: this.updatedAt?.toISOString(),
    };
  }
}

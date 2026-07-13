import { randomUUID } from 'crypto';
import { LicenseKeyEntity } from '../entities/LicenseKeyEntity';
import { LicenseKeyRepository } from '../ports/outbound/license-key-repository.port';
import { LicenseKeyService } from '../ports/inbound/license-key-service.port';
import { LicenseKeyPrimitives } from '../types/LicenseKeyPrimitives';
import {
  ActivateLicenseKeyInput,
  IssueLicenseKeyInput,
  LicenseExpiryAlertConfig,
  LicenseHistoryEntry,
  LicenseKeySearchFilters,
  RenewLicenseKeyInput,
  RevokeLicenseKeyInput,
  ValidateTenantOperationInput,
} from '../ports/types/LicenseKey';
import { EntityNotFoundException } from '../exceptions/entity/entity-not-found.exception';
import { NoActiveLicenseException } from '../exceptions/application/no-active-license.exception';
import { LicenseLimitExceededException } from '../exceptions/application/license-limit-exceeded.exception';

export class LicenseKeyDomainService implements LicenseKeyService {
  constructor(private readonly licenseKeyRepository: LicenseKeyRepository) {}

  // ─── RF-02.2: Emisión de licencias ───────────────────────────────────────────

  /**
   * Emite una nueva licencia para un tenant.
   * La firma digital (RF-02.4) es provista por el caller (capa de aplicación/infra).
   */
  async issue(input: IssueLicenseKeyInput): Promise<LicenseKeyPrimitives> {
    const now = new Date();

    const entity = LicenseKeyEntity.create({
      id: randomUUID(),
      tenantId: input.tenantId,
      licenseKey: input.licenseKey ?? randomUUID(),
      planType: input.planType,
      maxBranches: input.maxBranches,
      maxUsers: input.maxUsers,
      featuresEnabled: input.featuresEnabled ?? {},
      validFrom: (input.validFrom ?? now).toISOString(),
      validUntil: input.validUntil.toISOString(),
      graceDays: input.graceDays ?? 0,
      signatureHash: input.signatureHash,
      issuedBy: input.issuedBy,
      status: 'ACTIVE',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    });

    const saved = await this.licenseKeyRepository.save(entity);

    // RF-02.7: historial inmutable
    await this.licenseKeyRepository.saveHistory({
      id: randomUUID(),
      licenseKeyId: saved.toPrimitives().id,
      tenantId: input.tenantId,
      eventType: 'created',
      occurredAt: now,
      actor: input.issuedBy,
      payload: { planType: input.planType, validUntil: input.validUntil },
    });

    return saved.toPrimitives();
  }

  // ─── RF-02.2: Activación ──────────────────────────────────────────────────────

  async activate(
    licenseKeyId: string,
    input: ActivateLicenseKeyInput,
  ): Promise<LicenseKeyPrimitives> {
    const entity = await this.getEntityOrFail(licenseKeyId);
    const activatedAt = input.activatedAt ?? new Date();

    entity.activate(activatedAt);

    const saved = await this.licenseKeyRepository.save(entity);

    // RF-02.7: historial
    await this.licenseKeyRepository.saveHistory({
      id: randomUUID(),
      licenseKeyId,
      tenantId: saved.toPrimitives().tenantId,
      eventType: 'activated',
      occurredAt: activatedAt,
      actor: input.activatedBy,
    });

    return saved.toPrimitives();
  }

  // ─── RF-02: Renovación ────────────────────────────────────────────────────────

  async renew(licenseKeyId: string, input: RenewLicenseKeyInput): Promise<LicenseKeyPrimitives> {
    const entity = await this.getEntityOrFail(licenseKeyId);
    const now = new Date();

    entity.renew({
      validFrom: input.validFrom,
      validUntil: input.validUntil,
      planType: input.planType,
      maxBranches: input.maxBranches,
      maxUsers: input.maxUsers,
      featuresEnabled: input.featuresEnabled,
      graceDays: input.graceDays,
      signatureHash: input.signatureHash,
      issuedBy: input.issuedBy,
      updatedAt: now,
    });

    const saved = await this.licenseKeyRepository.save(entity);

    // RF-02.7: historial
    await this.licenseKeyRepository.saveHistory({
      id: randomUUID(),
      licenseKeyId,
      tenantId: saved.toPrimitives().tenantId,
      eventType: 'renewed',
      occurredAt: now,
      actor: input.issuedBy,
      payload: { newValidUntil: input.validUntil, planType: input.planType },
    });

    return saved.toPrimitives();
  }

  // ─── RF-02.6: Revocación inmediata ───────────────────────────────────────────

  async revoke(licenseKeyId: string, input: RevokeLicenseKeyInput): Promise<LicenseKeyPrimitives> {
    const entity = await this.getEntityOrFail(licenseKeyId);
    const revokedAt = input.revokedAt ?? new Date();

    entity.revoke({ revokedAt, revocationReason: input.revocationReason });

    // Persistencia directa con el método especializado del repositorio
    // para propagación en tiempo real (RF-02.6)
    await this.licenseKeyRepository.revoke(licenseKeyId, revokedAt, input.revocationReason);

    // RF-02.7: historial
    await this.licenseKeyRepository.saveHistory({
      id: randomUUID(),
      licenseKeyId,
      tenantId: entity.toPrimitives().tenantId,
      eventType: 'revoked',
      occurredAt: revokedAt,
      actor: input.revokedBy,
      payload: { reason: input.revocationReason },
    });

    return entity.toPrimitives();
  }

  // ─── Consultas ────────────────────────────────────────────────────────────────

  async getById(licenseKeyId: string): Promise<LicenseKeyPrimitives> {
    return (await this.getEntityOrFail(licenseKeyId)).toPrimitives();
  }

  async list(filters?: LicenseKeySearchFilters): Promise<LicenseKeyPrimitives[]> {
    const entities = await this.licenseKeyRepository.findAll(filters);
    return entities.map((e) => e.toPrimitives());
  }

  /**
   * Devuelve las licencias que vencerán dentro de N días. RF-02.5
   */
  async listExpiring(config: LicenseExpiryAlertConfig): Promise<LicenseKeyPrimitives[]> {
    const entities = await this.licenseKeyRepository.findExpiring(config);
    return entities.map((e) => e.toPrimitives());
  }

  /**
   * Obtiene la licencia activa de un tenant a una fecha dada.
   * Considera el grace period para determinar si sigue operativa. RF-02.8
   */
  async getActiveByTenantId(tenantId: string, asOf?: Date): Promise<LicenseKeyPrimitives> {
    const entity = await this.licenseKeyRepository.findActiveByTenantId(tenantId, asOf);

    if (!entity) {
      throw new NoActiveLicenseException(`No active license found for tenant: ${tenantId}`);
    }

    return entity.toPrimitives();
  }

  /**
   * Verifica si el tenant tiene al menos una licencia activa. RF-02.1
   */
  async hasActiveLicense(tenantId: string, asOf?: Date): Promise<boolean> {
    return this.licenseKeyRepository.existsActiveByTenantId(tenantId, asOf);
  }

  /**
   * Valida que el tenant puede operar bajo sus límites actuales.
   * Lanza excepción si viola algún límite (hard enforcement). RF-02.3
   */
  async validateTenantOperation(
    tenantId: string,
    input?: ValidateTenantOperationInput,
  ): Promise<void> {
    const snapshot = await this.licenseKeyRepository.findCurrentSnapshotByTenantId(
      tenantId,
      input?.asOf,
    );

    if (!snapshot) {
      throw new NoActiveLicenseException(
        `Tenant "${tenantId}" does not have an active license and cannot perform operations.`,
      );
    }

    if (input?.requiredBranches !== undefined && input.requiredBranches > snapshot.maxBranches) {
      throw new LicenseLimitExceededException(
        'branches',
        `License limit exceeded: tenant "${tenantId}" allows ${snapshot.maxBranches} branches, ` +
          `but ${input.requiredBranches} were required.`,
      );
    }

    if (input?.requiredUsers !== undefined && input.requiredUsers > snapshot.maxUsers) {
      throw new LicenseLimitExceededException(
        'users',
        `License limit exceeded: tenant "${tenantId}" allows ${snapshot.maxUsers} users, ` +
          `but ${input.requiredUsers} were required.`,
      );
    }

    if (input?.requiredFeatures?.length) {
      const missingFeatures = input.requiredFeatures.filter((f) => !snapshot.featuresEnabled?.[f]);
      if (missingFeatures.length > 0) {
        throw new LicenseLimitExceededException(
          'features',
          `License limit exceeded: tenant "${tenantId}" is missing features: ${missingFeatures.join(', ')}.`,
        );
      }
    }
  }

  /**
   * Versión booleana de validateTenantOperation. RF-02.3
   */
  async canTenantOperate(tenantId: string, input?: ValidateTenantOperationInput): Promise<boolean> {
    try {
      await this.validateTenantOperation(tenantId, input);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Historial inmutable de eventos sobre una licencia. RF-02.7
   */
  async getHistoryByLicenseKeyId(licenseKeyId: string): Promise<LicenseHistoryEntry[]> {
    return this.licenseKeyRepository.findHistoryByLicenseKeyId(licenseKeyId);
  }

  // ─── Helpers privados ─────────────────────────────────────────────────────────

  private async getEntityOrFail(licenseKeyId: string): Promise<LicenseKeyEntity> {
    const entity = await this.licenseKeyRepository.findById(licenseKeyId);

    if (!entity) {
      throw new EntityNotFoundException(`License key not found: ${licenseKeyId}`);
    }

    return entity;
  }
}

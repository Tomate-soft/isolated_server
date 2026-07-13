import { UpdateTenantProfileInput, UpdateTenantSecurityPolicyInput } from '../ports/types/Tenant';
import { TenantPrimitives } from '../types/TenantPrimitives';
import { TenantSecurityPolicy } from '../types/TenantSecurityPolicy';
import { TenantCountryCode } from '../value-objects/tenant/tenant-country-code.vo';
import { TenantCreatedAt } from '../value-objects/tenant/tenant-created-at.vo';
import { TenantCurrencyCode } from '../value-objects/tenant/tenant-currency-code.vo';
import { TenantId } from '../value-objects/tenant/tenant-id.vo';
import { TenantLegalName } from '../value-objects/tenant/tenant-legal-name.vo';
import { TenantName } from '../value-objects/tenant/tenant-name.vo';
import { TenantStatus } from '../value-objects/tenant/tenant-status.enum';
import { TenantTaxId } from '../value-objects/tenant/tenant-tax-id.vo';
import { TenantTimezone } from '../value-objects/tenant/tenant-timezone.vo';
import { TenantUpdatedAt } from '../value-objects/tenant/tenant-updated-at.vo';

/**
 * Aggregate Root del Bounded Context `tenant-management`.
 *
 * Encapsula el estado y el comportamiento de negocio de un tenant.
 * Ninguna capa exterior puede modificar el estado directamente — solo
 * a través de los métodos de dominio (`activate`, `suspend`, `updateProfile`, etc.).
 *
 * Patrones aplicados:
 *   - Constructor privado + `static create(primitives)` como única forma de instanciar.
 *   - `toPrimitives()` como única forma de serializar el estado al exterior.
 *   - Value Objects en todos los campos para garantizar invariantes en construcción.
 *
 * RF-01.1: ciclo de vida (activate, suspend, delete).
 * RF-01.3: configuración regional (profile).
 * RF-01.5: política de seguridad.
 */
export class TenantEntity {
  private constructor(
    private readonly id: TenantId,
    private name: TenantName,
    private legalName: TenantLegalName,
    private taxId: TenantTaxId,
    private countryCode: TenantCountryCode,
    private currencyCode: TenantCurrencyCode,
    private timezone: TenantTimezone,
    private securityPolicy: TenantSecurityPolicy | undefined,
    private status: TenantStatus,
    private readonly createdAt: TenantCreatedAt,
    private updatedAt: TenantUpdatedAt,
  ) {}

  // ─── Fábrica ──────────────────────────────────────────────────────────────────

  /**
   * Única forma de instanciar un `TenantEntity`.
   * Hidrata todos los campos a través de sus Value Objects,
   * garantizando que las invariantes se validen en construcción.
   */
  static create(params: TenantPrimitives): TenantEntity {
    return new TenantEntity(
      new TenantId(params.id),
      new TenantName(params.name),
      new TenantLegalName(params.legal_name),
      new TenantTaxId(params.tax_id),
      new TenantCountryCode(params.country_code),
      new TenantCurrencyCode(params.currency_code),
      new TenantTimezone(params.timezone),
      params.security_policy,
      TenantEntity.assertStatus(params.status ?? TenantStatus.ACTIVE),
      new TenantCreatedAt(params.created_at),
      new TenantUpdatedAt(params.updated_at),
    );
  }

  // ─── Comandos de negocio ──────────────────────────────────────────────────────

  /**
   * Actualiza los datos de perfil del tenant. RF-01.3
   * Solo modifica los campos provistos en el input (patch parcial).
   */
  updateProfile(input: UpdateTenantProfileInput): void {
    if (input.name !== undefined) {
      this.name = new TenantName(input.name);
    }

    if (input.legal_name !== undefined) {
      this.legalName = new TenantLegalName(input.legal_name);
    }

    if (input.tax_id !== undefined) {
      this.taxId = new TenantTaxId(input.tax_id);
    }

    if (input.country_code !== undefined) {
      this.countryCode = new TenantCountryCode(input.country_code);
    }

    if (input.currency_code !== undefined) {
      this.currencyCode = new TenantCurrencyCode(input.currency_code);
    }

    if (input.timezone !== undefined) {
      this.timezone = new TenantTimezone(input.timezone);
    }

    this.updatedAt = new TenantUpdatedAt(new Date());
  }

  /**
   * Actualiza la política de seguridad del tenant. RF-01.5
   * Hace un merge profundo: si se provee `passwordPolicy`, se fusiona con
   * la política existente en lugar de reemplazarla completamente.
   */
  updateSecurityPolicy(input: UpdateTenantSecurityPolicyInput): void {
    this.securityPolicy = {
      passwordPolicy: input.passwordPolicy
        ? {
            ...this.securityPolicy?.passwordPolicy,
            ...input.passwordPolicy,
          }
        : this.securityPolicy?.passwordPolicy,
      sessionPolicy: input.sessionPolicy
        ? {
            ...this.securityPolicy?.sessionPolicy,
            ...input.sessionPolicy,
          }
        : this.securityPolicy?.sessionPolicy,
    };

    this.updatedAt = new TenantUpdatedAt(new Date());
  }

  // ─── Ciclo de vida (RF-01.1) ─────────────────────────────────────────────────

  /** Bloquea el acceso del tenant temporalmente. */
  suspend(updatedAt: Date): void {
    this.status = TenantStatus.SUSPENDED;
    this.updatedAt = new TenantUpdatedAt(updatedAt);
  }

  /** Reactiva un tenant previamente suspendido. */
  activate(updatedAt: Date): void {
    this.status = TenantStatus.ACTIVE;
    this.updatedAt = new TenantUpdatedAt(updatedAt);
  }

  /** Eliminación lógica (soft-delete). El registro persiste en DB con status DELETED. */
  delete(updatedAt: Date): void {
    this.status = TenantStatus.DELETED;
    this.updatedAt = new TenantUpdatedAt(updatedAt);
  }

  // ─── Proyección ───────────────────────────────────────────────────────────────

  /**
   * Serializa el estado del aggregate a un objeto plano.
   * Es la única forma de extraer datos del tenant fuera del dominio.
   */
  toPrimitives(): TenantPrimitives {
    return {
      id: this.id.getValue(),
      name: this.name.getValue(),
      legal_name: this.legalName.getValue(),
      tax_id: this.taxId.getValue(),
      country_code: this.countryCode.getValue(),
      currency_code: this.currencyCode.getValue(),
      timezone: this.timezone.getValue(),
      security_policy: this.securityPolicy,
      status: this.status,
      created_at: this.createdAt.getValue(),
      updated_at: this.updatedAt.getValue(),
    };
  }

  // ─── Helpers privados ─────────────────────────────────────────────────────────

  /** Valida que el status sea un valor conocido del enum antes de asignarlo. */
  private static assertStatus(status: TenantStatus): TenantStatus {
    if (!Object.values(TenantStatus).includes(status)) {
      throw new Error(`invalid tenant status: ${status}`);
    }

    return status;
  }
}

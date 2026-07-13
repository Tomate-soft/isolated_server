/**
 * Representación plana (solo primitivos) del aggregate `LicenseKey`.
 *
 * Sirve como contrato de serialización entre capas:
 *   - Input de `LicenseKeyEntity.create()`.
 *   - Output de `licenseKeyEntity.toPrimitives()`.
 *   - Tipo de retorno de los Domain Services.
 *
 * Las fechas se representan como strings ISO 8601 (no `Date`) para
 * que este tipo sea serializable directamente a JSON sin conversión.
 */
export interface LicenseKeyPrimitives {
  id: string;
  tenantId: string;
  licenseKey: string;
  planType: string;
  maxBranches: number;
  maxUsers: number;
  featuresEnabled?: any;
  /** ISO 8601 — fecha desde la que la licencia es válida. */
  validFrom: string;
  /** ISO 8601 — fecha en la que vence la licencia (sin grace). */
  validUntil: string;
  /** Días adicionales de operación tras `validUntil`. RF-02.8 */
  graceDays: number;
  /** Hash HMAC-SHA256 o RSA para verificar integridad. RF-02.4 */
  signatureHash: string;
  issuedBy: string;
  status: string;
  activatedAt?: string;
  revokedAt?: string;
  revocationReason?: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Se lanza cuando un tenant intenta operar con una licencia que ha superado
 * su fecha de vencimiento y también el grace period configurado.
 *
 * RF-02.8: el sistema soporta períodos de gracia configurables.
 * Una licencia expirada-dentro-del-grace no lanza esta excepción,
 * solo la que ha superado `validUntil + graceDays`.
 *
 * @example
 * throw new LicenseExpiredException(
 *   `License for tenant "${tenantId}" expired on 2024-12-31 (grace period: 7 days)`
 * );
 */
export class LicenseExpiredException extends Error {
  __proto__ = Error;

  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, LicenseExpiredException.prototype);
  }
}

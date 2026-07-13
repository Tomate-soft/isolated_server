/**
 * Se lanza cuando un tenant intenta operar pero no tiene ninguna
 * licencia activa en el sistema.
 *
 * RF-02.1: cada tenant debe tener al menos una licencia activa para operar.
 *
 * @example
 * throw new NoActiveLicenseException(`Tenant "${tenantId}" has no active license`);
 */
export class NoActiveLicenseException extends Error {
  __proto__ = Error;

  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, NoActiveLicenseException.prototype);
  }
}

/**
 * Se lanza cuando un tenant intenta operar con una licencia
 * que ha sido revocada permanentemente.
 *
 * RF-02.6: la revocación es inmediata e irreversible.
 *
 * @example
 * throw new LicenseRevokedException(
 *   `License "${licenseKeyId}" has been revoked: non-payment`
 * );
 */
export class LicenseRevokedException extends Error {
  __proto__ = Error;

  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, LicenseRevokedException.prototype);
  }
}

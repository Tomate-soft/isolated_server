/**
 * Value Object que encapsula el valor de la clave de licencia (el string presentado al cliente).
 *
 * - Mínimo 8 caracteres para evitar colisiones triviales.
 * - En producción se genera como un UUID (36 chars) o un hash HMAC derivado.
 * - RF-02.4: la autenticidad se garantiza con el `signatureHash` de {@link LicenseKeyEntity},
 *   no con el valor de esta clave en sí.
 */
export class LicenseKeyValue {
  constructor(private readonly value: string) {
    if (!value || value.trim().length < 8) {
      throw new Error('License key must be at least 8 characters');
    }
  }
  getValue(): string {
    return this.value;
  }
}

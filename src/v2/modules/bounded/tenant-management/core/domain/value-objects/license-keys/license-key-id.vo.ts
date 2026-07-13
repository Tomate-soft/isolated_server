/**
 * Value Object que encapsula el identificador único de una licencia.
 *
 * - Formato: UUID v1-v8 (RFC 4122).
 * - Inmutable: se asigna al emitir la licencia y nunca cambia.
 * - La renovación genera una nueva versión de la misma licencia (no un nuevo ID).
 */
export class LicenseKeyId {
  private static readonly UUID_REGEX =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  constructor(private readonly value: string) {
    if (!LicenseKeyId.UUID_REGEX.test(value)) {
      throw new Error('LicenseKeyId must be a valid UUID');
    }
  }
  getValue(): string {
    return this.value;
  }
}

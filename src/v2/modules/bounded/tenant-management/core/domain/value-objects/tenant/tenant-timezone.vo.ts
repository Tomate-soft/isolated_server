/**
 * Value Object que encapsula la zona horaria del tenant.
 *
 * - Formato: identificador IANA (ej: "America/Mexico_City", "Europe/Madrid").
 * - Validación en runtime mediante {@link Intl.DateTimeFormat}, que usa
 *   la base de datos de zonas horarias del motor de JS — más fiable que
 *   una lista hardcodeada que puede quedar desactualizada.
 * - Afecta la presentación de fechas, el inicio del día contable
 *   y la generación de reportes diarios.
 * - RF-01.3: parte de la configuración regional del tenant.
 */
export class TenantTimezone {
  constructor(private readonly value: string) {
    if (!value?.trim()) {
      throw new Error('timezone is required');
    }

    try {
      new Intl.DateTimeFormat('en-US', { timeZone: value });
    } catch {
      throw new Error('timezone must be a valid IANA time zone');
    }
  }

  getValue(): string {
    return this.value;
  }
}

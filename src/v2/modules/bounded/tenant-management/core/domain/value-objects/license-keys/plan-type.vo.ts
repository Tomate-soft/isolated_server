/**
 * Planes de suscripción disponibles en la plataforma.
 * Cada plan define un conjunto de límites y características habilitadas
 * que se almacenan en {@link LicenseKeyEntity}.
 */
export enum PlanTypeEnum {
  /** Plan de entrada; capacidad mínima de sucursales y usuarios. */
  BASIC = 'BASIC',

  /** Plan intermedio; mayor capacidad y características adicionales. */
  STANDARD = 'STANDARD',

  /** Plan completo; sin restricciones de capacidad y todas las características. */
  PREMIUM = 'PREMIUM',
}

/**
 * Value Object que encapsula el tipo de plan de una licencia.
 *
 * Usa `static create()` para validar y normalizar el valor a mayúsculas,
 * previniendo que strings arbitrarios lleguen al dominio.
 */
export class PlanType {
  private constructor(private readonly value: PlanTypeEnum) {}

  static create(value: string): PlanType {
    const up = value.toUpperCase();
    if (!Object.values(PlanTypeEnum).includes(up as PlanTypeEnum)) {
      throw new Error('Invalid plan type');
    }
    return new PlanType(up as PlanTypeEnum);
  }

  getValue(): PlanTypeEnum {
    return this.value;
  }
}

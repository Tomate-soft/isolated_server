/**
 * Excepción base para errores de validación del dominio.
 *
 * Se lanza cuando un dato de entrada viola una regla de negocio
 * antes de llegar a construir un Value Object o una Entidad.
 *
 * Para errores de construcción de Value Objects, usar
 * {@link InvalidValueObjectException} que extiende de esta.
 *
 * @example
 * throw new DomainValidationException('validUntil must be a future date');
 */
export class DomainValidationException extends Error {
  __proto__ = Error;

  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, DomainValidationException.prototype);
  }
}

import { DomainValidationException } from './domain-validation.exception';

/**
 * Se lanza cuando un Value Object recibe un valor que no cumple
 * sus invariantes (formato, rango, longitud, etc.).
 *
 * Extiende {@link DomainValidationException} para que la infraestructura
 * pueda capturarla con un solo handler genérico de validación.
 *
 * Incluye el campo `field` para que la capa de presentación pueda
 * asociar el error al campo específico del formulario.
 *
 * @example
 * throw new InvalidValueObjectException('country_code', 'Must be an ISO-3166-1 alpha-2 code');
 */
export class InvalidValueObjectException extends DomainValidationException {
  /** Nombre del campo o Value Object que falló la validación. */
  readonly field: string;

  constructor(field: string, message: string) {
    super(`[${field}] ${message}`);
    this.field = field;
    Object.setPrototypeOf(this, InvalidValueObjectException.prototype);
  }
}

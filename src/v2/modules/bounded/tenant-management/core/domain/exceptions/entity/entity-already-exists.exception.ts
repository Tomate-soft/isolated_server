/**
 * Se lanza cuando se intenta crear un aggregate que ya existe
 * (violación de unicidad de negocio, no de base de datos).
 *
 * @example
 * throw new EntityAlreadyExistsException(`Tenant with taxId "${taxId}" already exists`);
 */
export class EntityAlreadyExistsException extends Error {
  __proto__ = Error;

  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, EntityAlreadyExistsException.prototype);
  }
}

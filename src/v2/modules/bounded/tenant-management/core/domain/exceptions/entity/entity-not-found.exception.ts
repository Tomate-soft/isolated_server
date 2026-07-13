/**
 * Se lanza cuando se busca un aggregate/entidad por ID y no existe en el repositorio.
 *
 * Uso típico: dentro de `getEntityOrFail()` en los Domain Services.
 *
 * @example
 * throw new EntityNotFoundException(`Tenant not found: ${tenantId}`);
 */
export class EntityNotFoundException extends Error {
  __proto__ = Error;

  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, EntityNotFoundException.prototype);
  }
}

/**
 * Se lanza cuando se intenta ejecutar una transición de estado inválida
 * en una entidad de dominio (violación de la máquina de estados).
 *
 * Ejemplos:
 *   - Activar un tenant ya ACTIVE.
 *   - Suspender un tenant DELETED.
 *   - Revocar una licencia ya REVOKED.
 *
 * @example
 * throw new EntityInvalidStateTransitionException(
 *   `Cannot activate tenant "${id}": current status is DELETED`
 * );
 */
export class EntityInvalidStateTransitionException extends Error {
  __proto__ = Error;

  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, EntityInvalidStateTransitionException.prototype);
  }
}

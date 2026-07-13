/**
 * Se lanza cuando una operación de tenant supera los límites definidos
 * en su licencia activa (hard enforcement).
 *
 * RF-02.3: el sistema debe rechazar acciones que excedan los límites.
 *
 * Contiene el campo `limitType` para identificar qué límite fue superado,
 * lo que permite a la capa de presentación mostrar mensajes específicos.
 *
 * @example
 * throw new LicenseLimitExceededException(
 *   'branches',
 *   `Tenant allows 3 branches but 5 were required`
 * );
 */
export class LicenseLimitExceededException extends Error {
  __proto__ = Error;

  /** El tipo de límite superado: 'branches' | 'users' | 'features' */
  readonly limitType: 'branches' | 'users' | 'features';

  constructor(limitType: 'branches' | 'users' | 'features', message: string) {
    super(message);
    this.limitType = limitType;
    Object.setPrototypeOf(this, LicenseLimitExceededException.prototype);
  }
}

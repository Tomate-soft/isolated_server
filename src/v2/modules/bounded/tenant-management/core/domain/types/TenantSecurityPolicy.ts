/**
 * Política de contraseñas configurable por tenant.
 * RF-01.5: cada tenant puede definir sus propias reglas de seguridad.
 *
 * Todos los campos son opcionales; si no se especifican, aplican
 * los valores por defecto de la plataforma (definidos en infraestructura).
 */
export interface TenantPasswordPolicy {
  /** Longitud mínima de la contraseña. */
  minLength?: number;
  /** Requiere al menos una letra mayúscula. */
  requireUppercase?: boolean;
  /** Requiere al menos una letra minúscula. */
  requireLowercase?: boolean;
  /** Requiere al menos un número. */
  requireNumber?: boolean;
  /** Requiere al menos un carácter especial (!@#$...). */
  requireSpecialCharacter?: boolean;
  /** Días máximos antes de forzar un cambio de contraseña. */
  maxPasswordAgeDays?: number;
}

/**
 * Política de sesión configurable por tenant.
 * RF-01.5: controla el comportamiento de las sesiones de usuario.
 */
export interface TenantSessionPolicy {
  /** Minutos de inactividad antes de cerrar sesión automáticamente. */
  sessionTimeoutMinutes?: number;
  /** Número máximo de sesiones activas simultáneas por usuario. */
  maxConcurrentSessions?: number;
  /** Permite que el usuario marque "recordarme" para sesiones persistentes. */
  allowRememberMe?: boolean;
}

/**
 * Política de seguridad completa del tenant.
 * Compuesta por sub-políticas independientes y opcionales.
 */
export interface TenantSecurityPolicy {
  passwordPolicy?: TenantPasswordPolicy;
  sessionPolicy?: TenantSessionPolicy;
}

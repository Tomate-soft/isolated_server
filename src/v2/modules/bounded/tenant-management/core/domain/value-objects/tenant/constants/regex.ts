/** Valida UUIDs versión 1-8 según RFC 4122. */
export const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/** Valida códigos de país de 2 letras según ISO-3166-1 alpha-2 (ej: MX, US, ES). */
export const COUNTRY_CODE_REGEX = /^[A-Z]{2}$/;

/** Valida códigos de moneda de 3 letras según ISO-4217 (ej: MXN, USD, EUR). */
export const CURRENCY_CODE_REGEX = /^[A-Z]{3}$/;

type AsyncFunction<T> = () => Promise<T>;

interface RetryOptions {
  retries?: number; // Número máximo de reintentos
  delayMs?: number; // Delay entre intentos
  retryOn?: (error: any) => boolean; // Función para decidir si reintentar
}

export async function retry<T>(fn: AsyncFunction<T>, options: RetryOptions = {}): Promise<T> {
  const { retries = 3, delayMs = 100, retryOn } = options;

  let attempt = 0;

  while (true) {
    try {
      return await fn();
    } catch (error) {
      attempt++;

      // Si se supera el máximo de reintentos o no cumple la condición, lanzar error
      if (attempt > retries || (retryOn && !retryOn(error))) {
        throw error;
      }

      console.warn(`Intento ${attempt} fallido, reintentando en ${delayMs}ms...`);
      await new Promise((res) => setTimeout(res, delayMs));
    }
  }
}

// employee-sales.query.ts
import { Injectable, Logger } from '@nestjs/common';
import { CreateEmployeeSale } from './create-employee-sale';

@Injectable()
export class EmployeeSalesQuery {
  private readonly logger = new Logger(EmployeeSalesQuery.name);

  private readonly MAX_RETRIES = 5;
  private readonly BASE_DELAY_MS = 200;

  constructor(private readonly createEmployeeSale: CreateEmployeeSale) {}

  async CreateEmployeeSale(body: any): Promise<any> {
    return this.executeWithRetry(
      () => this.createEmployeeSale.CreateEmployeeSale(body),
      this.MAX_RETRIES,
      this.BASE_DELAY_MS,
    );
  }

  // Reutilizable para cualquier operación
  private async executeWithRetry<T>(
    operation: () => Promise<T>,
    maxRetries: number,
    baseDelayMs: number,
  ): Promise<T> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        const isLastAttempt = attempt === maxRetries;
        const errorMessage = (error as Error).message || 'Error desconocido';

        this.logger.warn(`Intento ${attempt}/${maxRetries} falló: ${errorMessage}`);

        if (isLastAttempt) {
          this.logger.error(`Fallo definitivo tras ${maxRetries} intentos`);
          throw error;
        }

        // Backoff exponencial con jitter
        const maxDelay = baseDelayMs * Math.pow(2, attempt - 1);
        const delay = Math.floor(Math.random() * maxDelay);

        this.logger.debug(`Esperando ${delay}ms antes del siguiente intento...`);
        await new Promise((res) => setTimeout(res, delay));
      }
    }

    throw new Error('executeWithRetry: unreachable');
  }
}

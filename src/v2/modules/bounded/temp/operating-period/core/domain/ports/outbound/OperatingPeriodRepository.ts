import { OperatingPeriod } from 'src/schemas/operatingPeriod/operatingPeriod.schema';

export interface OperatingPeriodRepository {
  findById(id: string): Promise<OperatingPeriod | null>;
  findByMonth(month: string): Promise<OperatingPeriod[]>;
}

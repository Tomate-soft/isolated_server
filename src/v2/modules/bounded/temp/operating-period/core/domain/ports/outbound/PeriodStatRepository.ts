import { CreatePeriodStateDto } from '../../dto/CreatePeriodState.dto';
import { PeriodStatDto } from '../../entities/PeriodStat';

export interface PeriodStatRepository {
  save(createBody: CreatePeriodStateDto): Promise<void>;
  getById(id: string): Promise<PeriodStatDto | null>;
  getAll(): Promise<PeriodStatDto[]>;
}

import { CreatePeriodStatDomainDto } from '../../../shared/CreatePeriodStat.dto';
import { PeriodStat } from '../../entities/PeriodStat';

export interface PeriodStatService {
  generateDescription(note?: string): string;
  createPeriodStats(data: CreatePeriodStatDomainDto): Promise<PeriodStat>;
}

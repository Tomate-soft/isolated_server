import { CreatePeriodStatDomainDto } from '../../shared/CreatePeriodStat.dto';
import { PeriodStat } from '../entities/PeriodStat';
import { PeriodDescript } from '../vo/PeriodDescript';

export class PeriodStatsDomainServices {
  generateDescription(note?: string): string {
    const periodDescript = PeriodDescript.createShortDescript(note ?? '');
    return periodDescript;
  }

  createPeriodStats(data: CreatePeriodStatDomainDto): PeriodStat {
    if (!data.state || !data.descript)
      throw new Error('Missing required fields to create PeriodStat');
    const periodStat = PeriodStat.create(data);
    return periodStat;
  }
}

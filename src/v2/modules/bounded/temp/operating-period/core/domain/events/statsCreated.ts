import { DomainEvent } from '../../shared/DomainEvent';
import { PeriodStat } from '../entities/PeriodStat';

export class PeriodStatsCreated extends DomainEvent<PeriodStat> {
  static EVENT_NAME = 'operating-period-ms.period-stats-created';

  constructor(stats: PeriodStat) {
    super(stats);
  }

  getName(): string {
    return PeriodStatsCreated.EVENT_NAME;
  }
}

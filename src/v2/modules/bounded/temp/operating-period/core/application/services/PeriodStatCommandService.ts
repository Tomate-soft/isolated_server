import { Inject } from '@nestjs/common';
import { EVENT_BUS_PROVIDER, GENERATE_PERIOD_STATS_USE_CASE } from '../../../shared/constants';
import { DomainEventBus } from '../../shared/DomainEventBus';
import { CreatePeriodStat } from './use-cases/CreatePeriodStat';

export class PeriodStatCommandService {
  constructor(
    @Inject(EVENT_BUS_PROVIDER) private eventBus: DomainEventBus,
    @Inject(GENERATE_PERIOD_STATS_USE_CASE) private createPeriodStat: CreatePeriodStat,
  ) {}

  async create(id: string) {
    const newStats = await this.createPeriodStat.run(id);
    newStats.pullEvents().forEach((event) => this.eventBus.publish(event));
    return newStats;
  }
}

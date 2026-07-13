import { Inject } from '@nestjs/common';
import { PeriodStat } from '../../../domain/entities/PeriodStat';
import { OperatingPeriodRepository } from '../../../domain/ports/outbound/OperatingPeriodRepository';
import { PeriodStatRepository } from '../../../domain/ports/outbound/PeriodStatRepository';
import {PERIOD_STATS_REPOSITORY, PERIOD_REPOSITORY } from '../../../../shared/constants';

export class CreatePeriodStat {
  constructor(
    @Inject(PERIOD_REPOSITORY)
    private periodProvider: OperatingPeriodRepository,
    @Inject(PERIOD_STATS_REPOSITORY) 
    private statRepository: PeriodStatRepository,
  ) {}

  async run(id: string) {
    const period = await this.periodProvider.findById(id);
    if (!period) {
      throw new Error(`Operating period with ID ${id} not found`);
    }
    if (!period.operationalClousure) {
      throw new Error(`Operating period with ID ${id} is not closed yet`);
    }
    if (period.operationalClousure.state !== 'APPROVED') {
      throw new Error(`Operating period with ID ${id} is not in a closed state`);
    }
    const newStats = PeriodStat.create({
      state: period.operationalClousure?.state,
      descript: 'some description',
    });
    await this.statRepository.save(newStats.toJSON());
    return newStats;
  }
}

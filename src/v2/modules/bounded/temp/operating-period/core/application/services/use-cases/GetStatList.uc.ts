import { Inject } from '@nestjs/common';
import { PeriodStatDto } from '../../../domain/entities/PeriodStat';
import { PeriodStatRepository } from '../../../domain/ports/outbound/PeriodStatRepository';
import { PERIOD_STATS_REPOSITORY } from '../../../../shared/constants';

export class GetStatListUseCase {
  constructor(@Inject(PERIOD_STATS_REPOSITORY) private statRepository: PeriodStatRepository) {}

  async run(): Promise<PeriodStatDto[]> {
    const stats = await this.statRepository.getAll();
    return stats;
  }
}

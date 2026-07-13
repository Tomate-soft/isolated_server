import { Inject } from '@nestjs/common';
import { PeriodStatDto } from '../../../domain/entities/PeriodStat';
import { PeriodStatRepository } from '../../../domain/ports/outbound/PeriodStatRepository';
import { PERIOD_STATS_REPOSITORY } from '../../../../shared/constants';

export class GetPeriodStatByIdUseCase {
  constructor(@Inject(PERIOD_STATS_REPOSITORY) private readonly periodStatRepository: PeriodStatRepository) {}

  async run(id: string): Promise<PeriodStatDto | null> {
    return await this.periodStatRepository.getById(id);
  }
}

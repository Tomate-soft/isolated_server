import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PeriodStatQueriesService } from '../../../services/PeriodStatQueriesService';
import { PeriodStatDto } from '../../../../domain/entities/PeriodStat';
import { GetStatsByIdQuery } from '../GetStatsById.command';
import { PERIOD_STATS_QUERY_SERVICE } from '../../../../../shared/constants';
import { Inject } from '@nestjs/common';

@QueryHandler(GetStatsByIdQuery)
export class GetStatsByIdHandler implements IQueryHandler<GetStatsByIdQuery> {
  constructor(@Inject(PERIOD_STATS_QUERY_SERVICE) private readonly queriesService: PeriodStatQueriesService) {}

  async execute(query: GetStatsByIdQuery): Promise<PeriodStatDto | null> {
    const { id } = query;
    const result = await this.queriesService.getById(id);
    return result;
  }
}

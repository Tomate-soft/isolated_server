import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetListStatsQuery } from '../GetStatList.query';
import { PeriodStatQueriesService } from '../../../services/PeriodStatQueriesService';
import { Inject } from '@nestjs/common';
import { PERIOD_STATS_QUERY_SERVICE } from '../../../../../shared/constants';

@QueryHandler(GetListStatsQuery)
export class GetListStatHandler implements IQueryHandler<GetListStatsQuery> {
  constructor(@Inject(PERIOD_STATS_QUERY_SERVICE) private readonly periodStatQueriesService: PeriodStatQueriesService) {}

  async execute() {
    const stats = await this.periodStatQueriesService.getList();
    return stats;
  }
}

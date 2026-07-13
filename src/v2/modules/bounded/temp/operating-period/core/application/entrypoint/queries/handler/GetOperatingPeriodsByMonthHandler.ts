import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOperatingPeriodsByMonthQuery } from '../GetOperatingPeriodsByMonth.query';
import { Inject } from '@nestjs/common';
import { PERIOD_REPOSITORY } from '../../../../../shared/constants';
import { OperatingPeriodRepository } from '../../../../domain/ports/outbound/OperatingPeriodRepository';

@QueryHandler(GetOperatingPeriodsByMonthQuery)
export class GetOperatingPeriodsByMonthHandler implements IQueryHandler<GetOperatingPeriodsByMonthQuery> {
  constructor(
    @Inject(PERIOD_REPOSITORY) private readonly operatingPeriodRepository: OperatingPeriodRepository
    ,
  ) {}

  async execute(query: GetOperatingPeriodsByMonthQuery) {
    const periods = await this.operatingPeriodRepository.findByMonth(query.month);
    return periods;
  }
}

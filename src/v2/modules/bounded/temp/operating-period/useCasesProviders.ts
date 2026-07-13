import { CreatePeriodStat } from "./core/application/services/use-cases/CreatePeriodStat";
import { GetPeriodStatByIdUseCase } from "./core/application/services/use-cases/GetPeriodStatById.uc";
import { GetStatListUseCase } from "./core/application/services/use-cases/GetStatList.uc";
import { OperatingPeriodRepository } from "./core/domain/ports/outbound/OperatingPeriodRepository";
import { PeriodStatRepository } from "./core/domain/ports/outbound/PeriodStatRepository";
import { GENERATE_PERIOD_STATS_USE_CASE, GET_STATS_BY_ID,  PERIOD_REPOSITORY, PERIOD_STATS_REPOSITORY, GET_LIST_PERIOD_STATS_USE_CASE } from "./shared/constants";

// USE CASES
const GeneratePeriodStatProvider = {
  provide: GENERATE_PERIOD_STATS_USE_CASE,
  useFactory: (
    operatingPeriodRepository: OperatingPeriodRepository,
    periodStatRepository: PeriodStatRepository,
  ) => {
    return new CreatePeriodStat(operatingPeriodRepository, periodStatRepository);
  },
  inject: [PERIOD_STATS_REPOSITORY, PERIOD_REPOSITORY],
};


const GetListPeriodStatsProvider = {
  provide: GET_LIST_PERIOD_STATS_USE_CASE,
  useFactory: (periodStatRepository: PeriodStatRepository) => {
    return new GetStatListUseCase(periodStatRepository);
  },
  inject: [PERIOD_STATS_REPOSITORY],
};

const GetStatByIdProvider = {
  provide: GET_STATS_BY_ID,
  useFactory: (periodStatRepository: PeriodStatRepository) => {
    return new GetPeriodStatByIdUseCase(periodStatRepository);
  },
  inject: [PERIOD_STATS_REPOSITORY],
}; 

export const PeriodStatUseCasesProvider = [
    GeneratePeriodStatProvider,
    GetListPeriodStatsProvider,
    GetStatByIdProvider
];

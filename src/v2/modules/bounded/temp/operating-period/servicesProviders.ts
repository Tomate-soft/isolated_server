import { Provider } from "@nestjs/common";
import { PeriodStatCommandService } from "./core/application/services/PeriodStatCommandService";
import { PeriodStatQueriesService } from "./core/application/services/PeriodStatQueriesService";
import { CreatePeriodStat } from "./core/application/services/use-cases/CreatePeriodStat";
import { GetPeriodStatByIdUseCase } from "./core/application/services/use-cases/GetPeriodStatById.uc";
import { GetStatListUseCase } from "./core/application/services/use-cases/GetStatList.uc";
import { InMemoryEventBus } from "./infrastructure/adapters/in-memory-event-bus";
import { EVENT_BUS_PROVIDER, GENERATE_PERIOD_STATS_USE_CASE, GET_LIST_PERIOD_STATS_USE_CASE, GET_STATS_BY_ID, PERIOD_STATS_COMMAND_SERVICE, PERIOD_STATS_QUERY_SERVICE } from "./shared/constants";

// QUERIES SERVICE
const QueriesServiceProvider = {
  provide: PERIOD_STATS_QUERY_SERVICE,
  useFactory: (
    getByIdUseCase: GetPeriodStatByIdUseCase,
    getStatListUseCase: GetStatListUseCase,
  ) => {
    return new PeriodStatQueriesService(getByIdUseCase, getStatListUseCase); 
    },
  inject: [GET_STATS_BY_ID, GET_LIST_PERIOD_STATS_USE_CASE],
};


// COMMAND SERVICES
const CommandServicesProvider = {
  provide: PERIOD_STATS_COMMAND_SERVICE,
  useFactory: (eventBus: InMemoryEventBus, createPeriodStat: CreatePeriodStat) => {
    return new PeriodStatCommandService(eventBus, createPeriodStat);
  },
  inject: [EVENT_BUS_PROVIDER, GENERATE_PERIOD_STATS_USE_CASE],
}

export const PeriodStatServicesProvider:Provider[] = [
    QueriesServiceProvider,
    CommandServicesProvider
];


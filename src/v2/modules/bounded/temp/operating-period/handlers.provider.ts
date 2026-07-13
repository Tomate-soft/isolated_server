import { CreatePeriodStatsHandler } from "./core/application/entrypoint/commands/handlers/CreatePeriodStateHandler";
import { GetListStatHandler } from "./core/application/entrypoint/queries/handler/GetStatList.handler";
import { GetStatsByIdHandler } from "./core/application/entrypoint/queries/handler/GetStatsByIdHandler";
import { GetOperatingPeriodsByMonthHandler } from "./core/application/entrypoint/queries/handler/GetOperatingPeriodsByMonthHandler";

const CreatePeriodStatsHandlerProvider = {
  provide: CreatePeriodStatsHandler,
  useClass: CreatePeriodStatsHandler,
};

const GetListPeriodStatsHandlerProvider = {
  provide: GetListStatHandler,
  useClass: GetListStatHandler,
};

const GetStatByIdHandlerProvider = {
  provide: GetStatsByIdHandler,
  useClass: GetStatsByIdHandler,
};

const GetOperatingPeriodsByMonthHandlerProvider = {
  provide: GetOperatingPeriodsByMonthHandler,
  useClass: GetOperatingPeriodsByMonthHandler,
};


export const PeriodStatHandlersProvider = [
  CreatePeriodStatsHandlerProvider,
  GetListPeriodStatsHandlerProvider,
  GetStatByIdHandlerProvider,
  GetOperatingPeriodsByMonthHandlerProvider,
];
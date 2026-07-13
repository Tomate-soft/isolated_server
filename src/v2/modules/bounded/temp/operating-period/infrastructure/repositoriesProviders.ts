import { Provider } from "@nestjs/common"
import { PERIOD_REPOSITORY, PERIOD_STATS_REPOSITORY } from "../shared/constants"
import { MongoOperatingPeriodRepository } from "./persistence/mongo/repositories/MongoOperatingPeriod.repository"
import { MongoPeriodStateRepository } from "./persistence/mongo/repositories/PeriodState.repository"

const PeriodStatRepository = {
      provide: PERIOD_STATS_REPOSITORY,
      useClass: MongoPeriodStateRepository,
    }

const PeriodRepository = {
      provide: PERIOD_REPOSITORY,
      useClass: MongoOperatingPeriodRepository,
    }

export const PeriodStatRepositoriesProvider: Provider[] = [PeriodStatRepository, PeriodRepository]
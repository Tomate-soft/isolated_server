import { Module } from '@nestjs/common';
import { CoreModule } from './core/core.module';
import { InfrastructureModule } from './infrastructure/infrastructure.module';
import { PeriodStatUseCasesProvider } from './useCasesProviders';
import { PeriodStatServicesProvider } from './servicesProviders';
import { PeriodStatHandlersProvider } from './handlers.provider';
import { EventBusProvider } from './event-bus.provider';

@Module({
  imports: [CoreModule, InfrastructureModule],
  providers: [
    ...PeriodStatUseCasesProvider,
    ...PeriodStatServicesProvider,
    ...PeriodStatHandlersProvider,
    EventBusProvider,
  ],
})
export class OperatingPeriodModule {}
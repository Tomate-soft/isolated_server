import { Module } from '@nestjs/common';
import { PeriodsController } from './periods/controllers/periods.controller';
import { PeriodsService } from './periods/services/periods.service';
import { DataModule } from 'src/app/data/data.module';
import { IntegrationsService } from './integrations/integrations.service';
import { OperatingPeriodIntegration } from './integrations/operating-period.service';
import { RewritedPeriodIntegration } from './integrations/rewrited-period.service';

@Module({
  imports: [DataModule],
  controllers: [PeriodsController],
  providers: [
    PeriodsService,
    IntegrationsService,
    OperatingPeriodIntegration,
    RewritedPeriodIntegration,
  ],
})
export class RewritingModule {}

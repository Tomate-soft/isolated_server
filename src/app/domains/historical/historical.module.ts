import { Module } from '@nestjs/common';
import { PaymentsModule } from './payments/payments.module';
import { RewritedController } from './rewrited/rewrited.controller';
import { RewritedService } from './rewrited/integrations/rewrited.service';
import { DataModule } from 'src/app/data/data.module';
import { SubcategoriesController } from './subcategories/controllers/subcategories.controller';
import { SubcategoriesService } from './subcategories/services/subcategories.service';
import { IntegrationsService } from './integrations/integrations.service';
import { SubcategoriesIntegrationsService } from './integrations/subcategories-integrations.service';
import { DishesIntegration } from './integrations/dishes-integration';
import { DishesController } from './dishes/controllers/dishes.controller';
import { DishesService } from './dishes/services/dishes.service';

@Module({
  imports: [PaymentsModule, DataModule],
  controllers: [RewritedController, SubcategoriesController, DishesController],
  providers: [
    RewritedService,
    SubcategoriesService,
    IntegrationsService,
    SubcategoriesIntegrationsService,
    DishesIntegration,
    DishesService,
  ],
})
export class HistoricalModule {}

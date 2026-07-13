import { Injectable } from '@nestjs/common';
import { SubcategoriesIntegrationsService } from './subcategories-integrations.service';
import { DishesIntegration } from './dishes-integration';
import { Prices } from 'src/schemas/catalogo/dishes.schema';

@Injectable()
export class IntegrationsService {
  constructor(
    private subcategoriesIntegrations: SubcategoriesIntegrationsService,
    private dishesIntegration: DishesIntegration,
  ) {}

  async getSubcategoriesForCommand(): Promise<any[]> {
    return await this.subcategoriesIntegrations.getSubcategorisForCommand();
  }

  async getDishesForSales(type: Prices): Promise<any[]> {
    return await this.dishesIntegration.getDishesForSales(type);
  }
}

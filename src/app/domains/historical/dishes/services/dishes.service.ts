import { Injectable } from '@nestjs/common';
import { IntegrationsService } from '../../integrations/integrations.service';
import { Prices } from 'src/schemas/catalogo/dishes.schema';

@Injectable()
export class DishesService {
  constructor(private readonly integrationsService: IntegrationsService) {}

  async getDishesForSales(type: Prices) {
    return this.integrationsService.getDishesForSales(type);
  }
}

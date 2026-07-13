import { Injectable } from '@nestjs/common';
import { DataRepository } from 'src/app/data/data.repository';
import { Prices } from 'src/schemas/catalogo/dishes.schema';

@Injectable()
export class DishesIntegration {
  constructor(private readonly dataRepository: DataRepository) {}

  getDishesForSales(type: Prices) {
    return this.dataRepository.readDishesRepository.findAllForSales(type);
  }
}

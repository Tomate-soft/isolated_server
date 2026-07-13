import { Controller, Get, InternalServerErrorException, Param } from '@nestjs/common';
import { DishesService } from '../services/dishes.service';
import { Prices } from 'src/schemas/catalogo/dishes.schema';

@Controller('dishes-historical')
export class DishesController {
  constructor(private readonly dishesService: DishesService) {}

  @Get('for-sales/:type')
  async getDishesForSales(@Param('type') type: Prices) {
    try {
      const response = await this.dishesService.getDishesForSales(type);
      return response;
    } catch (error) {
      console.error('Error fetching dishes for sales:', error);
      throw new InternalServerErrorException('Dishes not found for the specified type');
    }
  }
}

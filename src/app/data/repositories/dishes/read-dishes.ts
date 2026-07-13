import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Dishes, Prices } from 'src/schemas/catalogo/dishes.schema';

@Injectable()
export class ReadDishes {
  constructor(@InjectModel(Dishes.name) private readonly dishesModel: Model<Dishes>) {}

  async findAll(): Promise<Dishes[]> {
    return this.dishesModel.find().exec();
  }

  async findAllForSales(type: Prices): Promise<Dishes[]> {
    const dishArray = await this.dishesModel.find().select('code dishesName status prices').exec();
    return dishArray.filter((dish) => {
      const { prices } = dish;
      const selectedPrice = prices.filter((price) => price.name === type);
      if (selectedPrice.length === 0) {
        return dish;
      }
      dish.prices = selectedPrice;
      return dish;
    });
  }
}

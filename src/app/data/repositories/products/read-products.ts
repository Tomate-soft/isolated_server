import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Prices, Products } from 'src/schemas/catalogo/products.schema';

@Injectable()
export class ReadProducts {
  constructor(@InjectModel(Products.name) private readonly productModel: Model<Products>) {}

  async productsForSales(): Promise<Products[]> {
    return this.productModel.find({ availableForSales: true }).exec();
  }

  private getFilterBySellType(sellType: string) {
    if (sellType === 'togo') {
      return Prices.TOGO;
    }
    if (sellType === 'rappi') {
      return Prices.RAPPI;
    }
    if (sellType === 'phone') {
      return Prices.PHONE;
    }
    if (sellType === 'employee') {
      return Prices.PHONE;
    }
    return Prices.ONSITE;
  }
}

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Discount } from 'src/schemas/ventas/discounts.schema';
import { getPeriodCourtesiesPipeline } from '../../pipelines/get-period-courtesies';
import { Model } from 'mongoose';
import { getProductsCourtesiesPipeline } from '../../pipelines/getProductCourtesies';

@Injectable()
export class CourtesiesDetailsByPeriod {
  constructor(@InjectModel(Discount.name) private readonly discountModel: Model<Discount>) {}

  async getAllCourtesiesDetailsByPeriod(period: string) {
    const pipeline = getPeriodCourtesiesPipeline(period);
    const courtesiesDetails = await this.discountModel.aggregate(pipeline);
    return courtesiesDetails;
  }

  async getProductsCourtesiesDetailsByPeriod(period: string) {
    const pipeline = getProductsCourtesiesPipeline(period);
    const courtesiesDetails = await this.discountModel.aggregate(pipeline);
    return courtesiesDetails;
  }
}

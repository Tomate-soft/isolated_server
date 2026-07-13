import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Bills } from '@schema/sales/bills.schema';
import { Model } from 'mongoose';
import { getQuantitySalesProductsPipeline } from '../../pipelines/get-quantity-sales-products';
import { RappiOrder } from 'src/schemas/ventas/orders/rappiOrder.schema';
import { ToGoOrder } from 'src/schemas/ventas/orders/toGoOrder.schema';
import { PhoneOrder } from 'src/schemas/ventas/orders/phoneOrder.schema';

@Injectable()
export class GetProductSales {
  constructor(
    @InjectModel(Bills.name) private readonly billsModel: Model<Bills>,
    @InjectModel(RappiOrder.name) private readonly rappiOrderModel: Model<RappiOrder>,
    @InjectModel(ToGoOrder.name) private readonly toGoOrderModel: Model<ToGoOrder>,
    @InjectModel(PhoneOrder.name) private readonly phoneOrderModel: Model<PhoneOrder>,
  ) {}

  async getAllSalesForProduct(period: string) {
    const pipeline = getQuantitySalesProductsPipeline(period);

    const [ositeResult, rappiResult, toGoResult, phoneResult] = await Promise.all([
      this.billsModel.aggregate(pipeline),
      this.rappiOrderModel.aggregate(pipeline),
      this.toGoOrderModel.aggregate(pipeline),
      this.phoneOrderModel.aggregate(pipeline),
    ]);
    return {
      ositeSales: ositeResult,
      rappiSales: rappiResult,
      toGoSales: toGoResult,
      phoneSales: phoneResult,
    };
  }
}

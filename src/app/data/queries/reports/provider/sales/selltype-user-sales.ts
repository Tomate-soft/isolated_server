import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Bills } from '@schema/sales/bills.schema';
import { Model } from 'mongoose';
import { PhoneOrder } from 'src/schemas/ventas/orders/phoneOrder.schema';
import { RappiOrder } from 'src/schemas/ventas/orders/rappiOrder.schema';
import { ToGoOrder } from 'src/schemas/ventas/orders/toGoOrder.schema';
import { getSellTypeSalesPipeline } from '../../pipelines/get-selltype-sales';
import { salesProductsByCategoryPipeline } from '../../pipelines/sales-products-by-category';

export enum SellTypeOptions {
  RESTAURANT = 'onSite',
  TOGO = 'TOGO_ORDER',
  PHONE = 'PHONE_ORDER',
  RAPPI = 'RAPPI_ORDER',
}

@Injectable()
export class SelltypeUserSales {
  constructor(
    @InjectModel(Bills.name) private readonly billsModel: Model<Bills>,
    @InjectModel(RappiOrder.name) private readonly rappiOrderModel: Model<RappiOrder>,
    @InjectModel(ToGoOrder.name) private readonly toGoOrderModel: Model<ToGoOrder>,
    @InjectModel(PhoneOrder.name) private readonly phoneOrderModel: Model<PhoneOrder>,
  ) {}

  async getTotalSellsReport(period: string, sellType: string) {
    const pipeline = getSellTypeSalesPipeline(period);
    if (sellType === SellTypeOptions.RAPPI) {
      const res = await this.toReportAdapter(
        await this.rappiOrderModel.aggregate(pipeline),
        sellType,
      );
      return res;
    }

    if (sellType === SellTypeOptions.TOGO) {
      const res = await this.toReportAdapter(
        await this.toGoOrderModel.aggregate(pipeline),
        sellType,
      );
      return res;
    }
    if (sellType === SellTypeOptions.PHONE) {
      const res = await this.toReportAdapter(
        await this.phoneOrderModel.aggregate(pipeline),
        sellType,
      );
      return res;
    }
    const res = await this.toReportAdapter(await this.billsModel.aggregate(pipeline), sellType);
    return res;
  }

  async getProductsSalesQuantity(period: string, sellType: string) {
    const pipeline = salesProductsByCategoryPipeline(period);
    if (sellType === SellTypeOptions.RAPPI) {
      const res = await this.toReportAdapter(
        await this.rappiOrderModel.aggregate(pipeline),
        sellType,
      );
      return res;
    }

    if (sellType === SellTypeOptions.TOGO) {
      const res = await this.toReportAdapter(
        await this.toGoOrderModel.aggregate(pipeline),
        sellType,
      );
      return res;
    }
    if (sellType === SellTypeOptions.PHONE) {
      const res = await this.toReportAdapter(
        await this.phoneOrderModel.aggregate(pipeline),
        sellType,
      );
      return res;
    }
    const res = await this.toReportAdapter(await this.billsModel.aggregate(pipeline), sellType);
    return res;
  }

  async toReportAdapter(data: any[], sellType: string) {
    return {
      period: new Date(data[0].date).toLocaleDateString(),
      type: sellType,
      data,
    };
  }
}

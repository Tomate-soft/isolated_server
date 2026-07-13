import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ToGoOrder } from 'src/schemas/ventas/orders/toGoOrder.schema';

@Injectable()
export class WriteTogoRepository {
  constructor(@InjectModel(ToGoOrder.name) private toGoOrdersModel: Model<ToGoOrder>) {}

  async createTogoOrder(body: any) {
    const newTogoOrder = new this.toGoOrdersModel(body);
    return await newTogoOrder.save();
  }

  async modifyTogoOrderProperties(id: string, body: any) {
    const newTogoOrder = await this.toGoOrdersModel.findByIdAndUpdate(id, body, {
      new: true,
    });
    return newTogoOrder;
  }
}

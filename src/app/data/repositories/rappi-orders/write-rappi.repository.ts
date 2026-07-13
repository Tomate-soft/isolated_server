import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RappiOrder } from 'src/schemas/ventas/orders/rappiOrder.schema';

@Injectable()
export class WriteRappiRepository {
  constructor(@InjectModel(RappiOrder.name) private rappiOrdersModel: Model<RappiOrder>) {}

  async createRappiOrder(body: any) {
    const newRappiOrder = new this.rappiOrdersModel(body);
    return await newRappiOrder.save();
  }

  async modifyRappiOrderProperties(id: string, body: any) {
    const newRappiOrder = await this.rappiOrdersModel.findByIdAndUpdate(id, body, {
      new: true,
    });
    return newRappiOrder;
  }
}

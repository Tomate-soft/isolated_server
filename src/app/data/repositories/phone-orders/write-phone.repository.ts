import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PhoneOrder } from 'src/schemas/ventas/orders/phoneOrder.schema';

@Injectable()
export class WritePhoneRepository {
  constructor(@InjectModel(PhoneOrder.name) private phoneOrdersModel: Model<PhoneOrder>) {}

  async createPhoneOrder(body: any) {
    const newPhoneOrder = new this.phoneOrdersModel(body);
    return await newPhoneOrder.save();
  }

  async modifyPhoneOrderProperties(id: string, body: any) {
    const newPhoneOrder = await this.phoneOrdersModel.findByIdAndUpdate(id, body, {
      new: true,
    });
    return newPhoneOrder;
  }
}

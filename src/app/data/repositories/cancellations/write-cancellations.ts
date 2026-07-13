import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { OrderCancel } from '@schema/cancellations/order-cancel.schema';
import { Model } from 'mongoose';
import { CreateOrderCancelDto } from '../../dto/cancellations/order-cancel/create-order-cancel.dto';

@Injectable()
export class WriteCancellations {
  constructor(@InjectModel(OrderCancel.name) private cancellationsModel: Model<OrderCancel>) {}

  async createOrderCancel(body: CreateOrderCancelDto) {
    const newCancellation = new this.cancellationsModel(body);
    const response = await newCancellation.save();
    return response;
  }
}

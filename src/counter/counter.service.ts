import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BillsCounter } from 'src/schemas/counters/billsCounter.schema';

@Injectable()
export class CounterService {
  constructor(@InjectModel(BillsCounter.name) private counterModel: Model<BillsCounter>) {}

  async getCounter() {
    return await this.counterModel.findOne();
  }

  async createCounter() {
    return await this.counterModel.create({ restaurantCounter: 1 });
  }
  async incrementCounter() {
    const currentCounter = await this.counterModel.findOne();
    const newCounter = currentCounter.restaurantCounter + 1;
    return await this.counterModel.findByIdAndUpdate(
      currentCounter._id,
      { $set: { restaurantCounter: newCounter } },
      { new: true },
    );
  }

  async resetCounter() {
    return await this.counterModel.findOneAndUpdate({
      $set: { restaurantCounter: 1 },
    });
  }
}

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Payment } from 'src/schemas/ventas/payment.schema';

interface PaymentsResponse {
  count: number;
  data: Payment[];
}

@Injectable()
export class ReadPaymentsRepository {
  constructor(@InjectModel(Payment.name) private paymentsModel: Model<Payment>) {}

  async findAll(page: number = 1, limit: number = 50): Promise<PaymentsResponse> {
    const skip = (page - 1) * limit;

    const [payments, paymentsCount] = await Promise.all([
      this.paymentsModel
        .find({})
        .find()
        .populate({
          path: 'accountId',
        })
        .lean()
        .populate({
          path: 'noteAccountId',
        })
        .lean()
        .populate({
          path: 'cashier',
        })
        .lean()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      this.paymentsModel.countDocuments({}),
    ]);
    return { count: paymentsCount, data: payments };
  }
}

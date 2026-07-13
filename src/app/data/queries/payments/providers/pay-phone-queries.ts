import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { ClientSession, Connection, Model } from 'mongoose';
import { toCompactDate } from 'src/app/common/libs/date/toCompactDate';
import { FINISHED_STATUS } from 'src/libs/status.libs';
import { User } from 'src/schemas/users.schema';
import { PhoneOrder } from 'src/schemas/ventas/orders/phoneOrder.schema';
import { Payment } from 'src/schemas/ventas/payment.schema';

@Injectable()
export class PayPhoneQueries {
  constructor(
    @InjectModel(Payment.name) private paymentModel: Model<Payment>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(PhoneOrder.name) private phoneOrderModel: Model<PhoneOrder>,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  async payPhoneOrder(id: string, body: any): Promise<{ order: PhoneOrder; payment: Payment }> {
    const todayPrefix = `PH${toCompactDate(new Date())}`;
    const response: {
      order: PhoneOrder;
      payment: Payment;
    } = {} as { order: PhoneOrder; payment: Payment };
    await this.connection.transaction(async (session) => {
      const order = await this.phoneOrderModel.findOneAndUpdate(
        { _id: id, status: { $ne: FINISHED_STATUS } },
        { $set: { status: FINISHED_STATUS } },
        { new: true, session },
      );

      if (!order) {
        throw new Error('Order not found');
      }

      const lastPay = await this.paymentModel
        .findOne({ paymentCode: { $regex: `^${todayPrefix}` } })
        .select('paymentCode')
        .sort({ createdAt: -1 })
        .session(session)
        .exec();

      const cashier = await this.userModel.findById(body.cashier).exec();

      const newCode = this.getNextPaymentCode(lastPay?.paymentCode);
      const data = {
        ...body,
        paymentCode: newCode,
        operatingPeriod: order.operatingPeriod,
        cashierSession: cashier.cashierSession,
      };

      const newPayment = new this.paymentModel(data);
      await newPayment.save({ session });

      await newPayment.populate({ path: 'accountId' });
      response.payment = newPayment;

      await this.addTipsToUser(order, newPayment, session);

      const updateBillData = {
        $push: { payment: newPayment._id },
        checkTotal: newPayment.paymentTotal,
      };

      await this.phoneOrderModel.findByIdAndUpdate(id, updateBillData, { session });
      response.order = order;
    });
    return response;
  }

  private getNextPaymentCode(lastPaymentCode: string): string {
    const today = toCompactDate(
      new Date().toLocaleString('en-US', {
        timeZone: 'America/Mexico_City',
      }),
    );
    const todayPrefix = `PH${today}`;

    if (!lastPaymentCode || !lastPaymentCode.startsWith(todayPrefix)) {
      return `${todayPrefix}000001`;
    }

    const lastPaymentCodeNumber = parseInt(lastPaymentCode.replace(todayPrefix, ''), 10) + 1;

    if (lastPaymentCodeNumber > 999999) {
      return `${todayPrefix}000001`;
    }

    return `${todayPrefix}${lastPaymentCodeNumber.toString().padStart(6, '0')}`;
  }

  private async addTipsToUser(
    billCurrent: any,
    createdPayment: any,
    session: ClientSession,
  ): Promise<User | null> {
    const transactions = createdPayment.transactions?.map((element) => {
      return {
        ...element,
        type: 'PH',
      };
    });

    const filteredTransactions = transactions?.filter((element) => parseFloat(element.tips) > 0);

    if (filteredTransactions?.length > 0) {
      return await this.userModel.findOneAndUpdate(
        { employeeNumber: parseInt(billCurrent.userCode, 10) },
        {
          $push: {
            tips: { $each: filteredTransactions || [] },
          },
        },
        { new: true, session },
      );
    }
  }
}

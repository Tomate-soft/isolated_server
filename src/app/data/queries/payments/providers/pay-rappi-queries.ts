import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { ClientSession, Connection, Model } from 'mongoose';
import { toCompactDate } from 'src/app/common/libs/date/toCompactDate';
import { FINISHED_STATUS } from 'src/libs/status.libs';
import { User } from 'src/schemas/users.schema';
import { RappiOrder } from 'src/schemas/ventas/orders/rappiOrder.schema';
import { Payment } from 'src/schemas/ventas/payment.schema';

@Injectable()
export class PayRappiQueries {
  constructor(
    @InjectModel(Payment.name) private paymentModel: Model<Payment>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(RappiOrder.name) private rappiOrderModel: Model<RappiOrder>,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  async payTogoOrder(id: string, body: any): Promise<any> {
    const todayPrefix = `RP${toCompactDate(new Date())}`;
    const response: {
      order: RappiOrder;
      payment: Payment;
    } = {} as { order: RappiOrder; payment: Payment };
    await this.connection.transaction(async (session) => {
      const order = await this.rappiOrderModel.findOneAndUpdate(
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

      await this.rappiOrderModel.findByIdAndUpdate(id, updateBillData, { session });
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
    const todayPrefix = `RP${today}`;

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
        type: 'RP',
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

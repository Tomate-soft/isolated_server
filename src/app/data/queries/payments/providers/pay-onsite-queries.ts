import { Injectable } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Bills } from '@schema/sales/bills.schema';
import { ClientSession, Connection } from 'mongoose';
import { Model } from 'mongoose';
import { toCompactDate } from 'src/app/common/libs/date/toCompactDate';
import { CreatePaymentDto } from 'src/dto/ventas/payments/createPaymentDto';
import { FINISHED_STATUS, FREE_STATUS } from 'src/libs/status.libs';
import { Table } from 'src/schemas/tables/tableSchema';
import { User } from 'src/schemas/users.schema';
import { Discount } from 'src/schemas/ventas/discounts.schema';
import { Notes } from 'src/schemas/ventas/notes.schema';
import { Payment } from 'src/schemas/ventas/payment.schema';

@Injectable()
export class PayOnsiteQueries {
  constructor(
    @InjectModel(Bills.name) private billsModel: Model<Bills>,
    @InjectModel(Payment.name) private paymentModel: Model<Payment>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Table.name) private tableModel: Model<Table>,
    @InjectConnection() private readonly session: Connection,
    @InjectModel(Discount.name) private discountModel: Model<Discount>,
    @InjectModel(Notes.name) private noteModel: Model<Notes>,
  ) {}

  async payOnsiteOrder(id: string, body: CreatePaymentDto): Promise<any> {
    const todayPrefix = `RT${toCompactDate(new Date())}`;
    let response: Payment;
    await this.session.transaction(async (session: ClientSession) => {
      //        1. Intentar "cerrar" la cuenta en la misma operación
      const bill = await this.billsModel.findOneAndUpdate(
        { _id: id, status: { $ne: FINISHED_STATUS } },
        { $set: { status: FINISHED_STATUS } },
        { new: true, session },
      );

      if (!bill) {
        throw new Error('Bill no encontrada o ya está cerrada');
      }

      const lastPay = await this.paymentModel
        .findOne({ paymentCode: { $regex: `^${todayPrefix}` } })
        .select('paymentCode')
        .sort({ createdAt: -1 })
        .session(session)
        .exec();

      // encontremos al cajero que cobra yy metemos su session al pago
      const cashier = await this.userModel.findById(body.cashier).exec();
      const newCode = this.getNextPaymentCode(lastPay?.paymentCode);

      const data = {
        ...body,
        paymentCode: newCode,
        operatingPeriod: bill.operatingPeriod,
        cashierSession: cashier.cashierSession,
      };

      const newPayment = new this.paymentModel(data);
      await newPayment.save({ session });

      await newPayment.populate({ path: 'accountId', populate: { path: 'discount' } });
      response = newPayment;

      await this.addTipsToUser(bill, newPayment, session);
      // update docker container

      // 6. Actualizar bill con payment
      const updateBillData = {
        $push: { payment: newPayment._id },
        checkTotal: newPayment.paymentTotal,
      };

      await this.billsModel.findByIdAndUpdate(id, updateBillData, { session });
      await this.tableModel.findByIdAndUpdate(
        bill.table,
        {
          status: FREE_STATUS,
          bill: [],
        },
        { session },
      );
    });

    return response;
  }

  async payNoteInBill(id: string, body: CreatePaymentDto): Promise<any> {
    const todayPrefix = `RT${toCompactDate(new Date())}`;
    const response: {
      payment: Payment;
      note: Notes;
      bill: Bills;
    } = {} as { payment: Payment; note: Notes; bill: Bills };

    await this.session.transaction(async (session: ClientSession) => {
      const note = await this.noteModel.findOneAndUpdate(
        { _id: id, status: { $ne: FINISHED_STATUS } },
        { $set: { status: FINISHED_STATUS } },
        { new: true, session },
      );

      await note.populate({ path: 'discount' });

      if (!note) {
        throw new Error('Note no encontrada');
      }

      const [lastPay, currentBill] = await Promise.all([
        this.paymentModel
          .findOne({ paymentCode: { $regex: `^${todayPrefix}` } })
          .select('paymentCode')
          .sort({ createdAt: -1 })
          .session(session)
          .exec(),
        this.billsModel
          .findById(note.accountId)
          .populate(['notes', 'payment'])
          .session(session)
          .exec(),
      ]);
      const cashier = await this.userModel.findById(body.cashier).exec();
      const newCode = this.getNextPaymentCode(lastPay?.paymentCode);
      const newPayment = new this.paymentModel({
        ...body,
        paymentCode: newCode,
        operatingPeriod: currentBill.operatingPeriod,
        cashierSession: cashier.cashierSession,
      });
      await newPayment.save({ session });

      const updateNoteData = {
        paymentCode: newPayment._id ?? 'NP',
      };

      await this.noteModel.findByIdAndUpdate(id, updateNoteData, { session });

      const paymentTotal = currentBill?.payment?.reduce((acc, payment) => {
        return acc + parseFloat(payment.paymentTotal);
      }, 0);

      const enableNotes = currentBill.notes.filter((note) => note.status !== FINISHED_STATUS);

      const newTotal = paymentTotal + parseFloat(newPayment.paymentTotal);

      const updatedBillData: any = {
        payment: [...(currentBill.payment ?? []), newPayment._id],
        checkTotal: newTotal.toString(),
      };

      if (enableNotes?.length <= 0) {
        await this.tableModel.findByIdAndUpdate(currentBill.table, {
          status: FREE_STATUS,
          bill: [],
        });

        updatedBillData.status = FINISHED_STATUS;
      }

      await this.billsModel.findByIdAndUpdate(currentBill._id, updatedBillData, { session });
      await this.addTipsToUser(currentBill, newPayment, session);

      response.payment = newPayment;
      response.note = note;
      response.bill = currentBill;
    });

    return response;
  }

  private getNextPaymentCode(lastPaymentCode: string): string {
    const today = toCompactDate(
      new Date().toLocaleString('en-US', {
        timeZone: 'America/Mexico_City',
      }),
    );
    const todayPrefix = `RT${today}`;

    if (!lastPaymentCode || !lastPaymentCode.startsWith(todayPrefix)) {
      return `${todayPrefix}000001`;
    }

    const lastPaymentCodeNumber = parseInt(lastPaymentCode.replace(todayPrefix, ''), 10) + 1;

    if (lastPaymentCodeNumber > 999999) {
      return `${todayPrefix}000001`;
    }

    return `${todayPrefix}${lastPaymentCodeNumber.toString().padStart(6, '0')}`;
  }

  private async addTipsToUser(billCurrent: any, createdPayment: any, session: ClientSession) {
    const transactions = createdPayment.transactions?.map((element) => {
      return {
        ...element,
        type: 'RT',
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

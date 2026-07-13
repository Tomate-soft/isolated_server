import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePaymentDto } from 'src/dto/ventas/payments/createPaymentDto';
import { UpdatePaymentDto } from 'src/dto/ventas/payments/updatePaymentDto';
import { branchId } from 'src/variablesProvisionales';
import {
  ENABLE_STATUS,
  FINISHED_STATUS,
  FOR_PAYMENT_STATUS,
  FREE_STATUS,
} from 'src/libs/status.libs';
import { ReportsService } from 'src/reports/reports.service';
import { Branch } from 'src/schemas/business/branchSchema';
import { CashierSession } from 'src/schemas/cashierSession/cashierSession';
import { OperatingPeriod } from 'src/schemas/operatingPeriod/operatingPeriod.schema';
import { Table } from 'src/schemas/tables/tableSchema';
import { User } from 'src/schemas/users.schema';
import { Bills } from '@schema/sales/bills.schema';
import { Notes } from 'src/schemas/ventas/notes.schema';
import { PhoneOrder } from 'src/schemas/ventas/orders/phoneOrder.schema';
import { RappiOrder } from 'src/schemas/ventas/orders/rappiOrder.schema';
import { ToGoOrder } from 'src/schemas/ventas/orders/toGoOrder.schema';
import { Payment } from 'src/schemas/ventas/payment.schema';
import { OperatingPeriodService } from 'src/operating-period/operating-period.service';
import { MoneyMovementType } from 'src/dto/moneyMovements/moneyMovement.dto';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectModel(Payment.name) private paymentModel: Model<Payment>,
    @InjectModel(Notes.name) private readonly noteModel: Model<Notes>,
    @InjectModel(Bills.name) private readonly billModel: Model<Bills>,
    @InjectModel(Table.name) private readonly tableModel: Model<Table>,
    @InjectModel(Branch.name) private readonly branchModel: Model<Branch>,
    @InjectModel(OperatingPeriod.name)
    private readonly operatingPeriodModel: Model<OperatingPeriod>,
    @InjectModel(RappiOrder.name)
    private readonly rappiOrderModel: Model<RappiOrder>,
    @InjectModel(ToGoOrder.name)
    private readonly toGoOrderModel: Model<ToGoOrder>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(CashierSession.name)
    private readonly cashierSessionModel: Model<CashierSession>,
    private reportsService: ReportsService,
    @InjectModel(PhoneOrder.name)
    private readonly phoneOrderModel: Model<PhoneOrder>,
    private readonly operatingPeriodService: OperatingPeriodService,
  ) {}

  async findAll() {
    return await this.paymentModel
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
      .lean();
  }

  async findOne(id: string) {
    return await this.paymentModel.findById(id);
  }

  async findCurrent() {
    const session = await this.paymentModel.startSession();
    session.startTransaction();
    try {
      const branch = await this.branchModel.findById(branchId);
      if (!branch) {
        await session.abortTransaction();
        session.endSession();
        throw new NotFoundException('No se encontro la branch');
      }
      const periodId = branch.operatingPeriod;
      const period = await this.operatingPeriodModel.findById(periodId);
      const payments = await this.paymentModel
        .find({
          operatingPeriod: periodId,
        })
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
        .lean();
      if (!payments) {
        await session.abortTransaction();
        session.endSession();
        throw new NotFoundException('No se encontro el periodo operativo');
      }
      await session.commitTransaction();
      session.endSession();
      return payments;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }

  async create(createdPayment: CreatePaymentDto) {
    const session = await this.paymentModel.startSession();
    session.startTransaction();
    const bill = await this.billModel.findById(createdPayment.accountId);
    if (!bill) {
      await session.abortTransaction();
      session.endSession();
      throw new NotFoundException('No se encontro la cuenta');
    }
    ////////////////////////////////////////////////////////////////////////////////////
    // 1. Intentar "cerrar" la cuenta en la misma operación
    // const bill = await this.billModel.findOneAndUpdate(
    //   { _id: createdPayment.accountId, status: { $ne: FINISHED_STATUS } },
    //   { $set: { status: FINISHED_STATUS } },
    //   { new: true, session },
    // );
    ///////////////////////////////////////////////////////////////////////////////////

    if (bill.status === FINISHED_STATUS) {
      await session.abortTransaction();
      session.endSession();
      throw new NotFoundException('La cuenta no se encuentra en estado de pago');
    }
    try {
      const lastPaymentCode = await this.paymentModel.findOne({}).sort({ createdAt: -1 }).exec();
      const nextPaymentCode = lastPaymentCode
        ? this.getNextPaymentCode(parseFloat(lastPaymentCode.paymentCode))
        : 1;
      const newCode = nextPaymentCode.toString();
      const formatCode = this.formatCode(newCode);

      const branch = await this.branchModel.findById(branchId);
      if (!branch) {
        await session.abortTransaction();
        session.endSession();
        throw new NotFoundException('No se encontro la branch');
      }
      const periodId = branch.operatingPeriod;
      const OperatingPeriod = await this.operatingPeriodModel.findById(periodId);

      ////////////////////////////////////////////////////////////////////////////////////
      // 3. Buscar branch y operatingPeriod
      // const branch = await this.branchModel.findById(branchId, {}, { session });
      // if (!branch) {
      //   throw new NotFoundException('No se encontró la branch');
      // }
      // const OperatingPeriod = await this.operatingPeriodModel.findById(
      //   branch.operatingPeriod,
      //   {},
      //   { session },
      // );

      ////////////////////////////////////////////////////////////////////////////////////

      const newPaymentCode = new this.paymentModel({
        ...createdPayment,
        paymentCode: formatCode,
        operatingPeriod: OperatingPeriod._id,
      });

      if (!createdPayment?.transactions?.some((element) => element.paymentType === 'courtesy')) {
        await newPaymentCode.save();
      }

      const billCurrent = await this.billModel
        .findById(createdPayment.accountId)
        .populate({ path: 'payment' });

      const table = await this.tableModel.findById(billCurrent.table);
      if (table.status !== FOR_PAYMENT_STATUS) {
        session.abortTransaction();
        session.endSession();
        throw new NotFoundException('La mesa no se encuentra en estado de pago');
      }

      await this.addTipsToUser(billCurrent, createdPayment);

      const updatedBillData = {
        payment: [...billCurrent.payment, newPaymentCode._id],
        status: FINISHED_STATUS,
        checkTotal: createdPayment.paymentTotal,
      };
      const updatedBill = await this.billModel.findByIdAndUpdate(billCurrent._id, updatedBillData);
      if (!updatedBill) {
        throw new NotFoundException('No se pudo actualizar la factura');
      }

      // vamos a actualizar la mesa
      const updatedTable = await this.tableModel.findByIdAndUpdate(table._id, {
        status: FREE_STATUS,
        bill: [],
      });
      if (!updatedTable) {
        await session.abortTransaction();
        await session.endSession();
        throw new NotFoundException('No se pudo actualizar la mesa');
      }
      await newPaymentCode.populate({
        path: 'accountId',
      });
      await session.commitTransaction();
      session.endSession();
      return newPaymentCode;
    } catch (error) {
      console.error(error);
    }
  }

  async delete(id: string) {
    return await this.paymentModel.findByIdAndDelete(id);
  }

  async update(id: string, updatePayment: UpdatePaymentDto) {
    return await this.paymentModel.findByIdAndUpdate(id, updatePayment, {
      new: true,
    });
  }

  async paymentNote(id: string, body: { accountId: string; body: CreatePaymentDto }) {
    const session = await this.paymentModel.startSession();
    session.startTransaction();
    const note = await this.noteModel.findById(id);
    if (!note) {
      throw new NotFoundException(`No se encontro la nota`);
    }
    if (note.status !== FOR_PAYMENT_STATUS) {
      throw new NotFoundException(`La nota no tiene estado por pagar o ya se pago`);
    }
    try {
      const lastPaymentCode = await this.paymentModel.findOne({}).sort({ createdAt: -1 }).exec();

      const nextPaymentCode = lastPaymentCode
        ? this.getNextPaymentCode(parseFloat(lastPaymentCode.paymentCode))
        : 1;

      const newCode = nextPaymentCode.toString();
      const formatCode = this.formatCode(newCode);

      const branch = await this.branchModel.findById(branchId);
      if (!branch) {
        await session.abortTransaction();
        session.endSession();
        throw new NotFoundException('No se encontro la branch');
      }
      const periodId = branch.operatingPeriod;
      const OperatingPeriod = await this.operatingPeriodModel.findById(periodId);

      const newPayment = new this.paymentModel({
        ...body.body,
        paymentCode: formatCode,
        operatingPeriod: OperatingPeriod._id,
      });

      if (!newPayment) {
        throw new NotFoundException(`No se pudo crear el pago`);
      }
      if (parseFloat(newPayment.paymentTotal) > 0) {
        await newPayment.save();
      }

      const dataInjectInNote = {
        status: FINISHED_STATUS,
        paymentCode: parseFloat(newPayment.paymentTotal) > 0 ? newPayment._id : 'NP',
      };
      const note = await this.noteModel.findById(id);
      if (!note) {
        throw new NotFoundException(`No se encontro la nota`);
      }
      if (note.status !== FOR_PAYMENT_STATUS) {
        throw new NotFoundException(`La nota no tiene estado por pagar o ya se pago`);
      }
      await this.noteModel.findByIdAndUpdate(id, dataInjectInNote);
      const currentBill = await this.billModel
        .findById(body.accountId)
        .populate({ path: 'notes' })
        .populate({ path: 'payment' });

      const paymentTotal = currentBill.payment?.reduce((acc, payment) => {
        return acc + parseFloat(payment.paymentTotal);
      }, 0);

      const enableNotes = currentBill.notes.filter(
        (note) => note.status === ENABLE_STATUS || note.status === FOR_PAYMENT_STATUS,
      );

      // el nuevo total va ser el calculo de lo spagos que ya tenga la cuienta mas el que se acaba de crear
      const nuevoTotal = currentBill.payment?.reduce((acc, payment) => {
        return acc + parseFloat(payment.paymentTotal);
      }, 0);
      const newTotal = nuevoTotal + parseFloat(newPayment.paymentTotal);
      if (enableNotes?.length <= 0) {
        const tableUpdated = await this.tableModel.findByIdAndUpdate(currentBill.table, {
          status: FREE_STATUS,
          bill: [],
        });

        const updatedBillData = {
          payment: [...(currentBill.payment ?? []), newPayment._id],
          status: FINISHED_STATUS,
          checkTotal: newTotal.toString(),
        };
        await this.billModel.findByIdAndUpdate(currentBill._id, updatedBillData);
        await session.commitTransaction();
        session.endSession();
      }

      const updatedBillData = {
        payment: [...(currentBill.payment ?? []), newPayment._id],
        checkTotal: newTotal.toString(),
      };

      await this.billModel.findByIdAndUpdate(currentBill._id, updatedBillData);

      await this.addTipsToUser(currentBill, newPayment);
      await session.commitTransaction();
      session.endSession();
      return {
        payment: newPayment,
        note: note,
        bill: currentBill,
      };
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.error(error);
    }
  }

  async paymentToGo(data: { waiterId: string; body: any }) {
    const session = await this.paymentModel.startSession();
    session.startTransaction();
    // la togo order es encontrada aca
    const currentBill = await this.toGoOrderModel.findById(data.body.accountId);
    if (!currentBill) {
      await session.abortTransaction();
      session.endSession();
      throw new NotFoundException('No se encontro la togo order');
    }
    if (currentBill.status === FINISHED_STATUS) {
      await session.abortTransaction();
      session.endSession();
      throw new NotFoundException('La togo order ya se pago');
    }
    try {
      const lastPaymentCode = await this.paymentModel.findOne({}).sort({ createdAt: -1 }).exec();
      const nextPaymentCode = lastPaymentCode
        ? this.getNextPaymentCode(parseFloat(lastPaymentCode.paymentCode))
        : 1;

      const newCode = nextPaymentCode.toString();
      const formatCode = this.formatCode(newCode);

      const branch = await this.branchModel.findById(branchId);
      if (!branch) {
        await session.abortTransaction();
        session.endSession();
        throw new NotFoundException('No se encontro la branch');
      }
      const periodId = branch.operatingPeriod;
      const OperatingPeriod = await this.operatingPeriodModel.findById(periodId);

      // aca debemos pasar el body para crear el pago
      const newPayment = new this.paymentModel({
        ...data.body,
        paymentCode: formatCode,
        operatingPeriod: OperatingPeriod._id,
      });
      await newPayment.save();
      // la data que vamos a cambiar de la orden
      const updatedToGoOrder = {
        payment: [newPayment._id],
        status: FINISHED_STATUS,
        checkTotal: newPayment.paymentTotal,
      };

      const toGoOrderUpdated = await this.toGoOrderModel.findByIdAndUpdate(
        currentBill._id,
        updatedToGoOrder,
      );

      const tips = newPayment.transactions?.some((element) => element.tips?.length > 0);
      if (tips) {
        await this.userModel.findByIdAndUpdate(
          data.waiterId,
          {
            $push: {
              tips: { $each: newPayment.transactions || [] },
              togoorders: currentBill._id,
            },
          },
          { new: true },
        );
      }
      // falta el cashierSession actualizado
      const cashier = await this.userModel.findById(data.body.cashier);
      const sessionCashier = await this.cashierSessionModel.findById(cashier.cashierSession);
      const updatedCashierSession = {
        togoorders: [...sessionCashier.togoorders, currentBill._id],
      };

      const cashierSessionUpdated = await this.cashierSessionModel.findByIdAndUpdate(
        sessionCashier._id,
        updatedCashierSession,
      );

      await session.commitTransaction();
      session.endSession();

      return {
        order: toGoOrderUpdated,
        payment: newPayment,
      };
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
    }
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////

  async paymentPhoneOrder(data: { waiterId: string; body: any }) {
    const session = await this.paymentModel.startSession();
    session.startTransaction();
    const currentBill = await this.phoneOrderModel.findById(data.body.accountId);
    if (!currentBill) {
      await session.abortTransaction();
      session.endSession();
      throw new NotFoundException('No se encontro la orden');
    }
    if (currentBill.status === FINISHED_STATUS) {
      await session.abortTransaction();
      session.endSession();
      throw new NotFoundException('La orden ya se pago');
    }
    try {
      const lastPaymentCode = await this.paymentModel.findOne({}).sort({ createdAt: -1 }).exec();

      const nextPaymentCode = lastPaymentCode
        ? this.getNextPaymentCode(parseFloat(lastPaymentCode.paymentCode))
        : 1;

      const newCode = nextPaymentCode.toString();
      const formatCode = this.formatCode(newCode);

      const branch = await this.branchModel.findById(branchId);
      if (!branch) {
        await session.abortTransaction();
        session.endSession();
        throw new NotFoundException('No se encontro la branch');
      }
      const periodId = branch.operatingPeriod;
      const OperatingPeriod = await this.operatingPeriodModel.findById(periodId);

      // aca debemos pasar el body para crear el pago
      const newPayment = new this.paymentModel({
        ...data.body,
        paymentCode: formatCode,
        operatingPeriod: OperatingPeriod._id,
      });
      await newPayment.save();

      const updatedPhoneOrder = {
        payment: [newPayment._id],
        status: FINISHED_STATUS,
      };

      const phoneOrderUpdated = await this.phoneOrderModel.findByIdAndUpdate(
        currentBill._id,
        updatedPhoneOrder,
      );

      const tips = newPayment.transactions?.some((element) => element.tips?.length > 0);
      if (tips) {
        await this.userModel.findByIdAndUpdate(
          data.waiterId,
          {
            $push: {
              tips: { $each: newPayment.transactions || [] },
              phoneOrders: currentBill._id,
            },
          },
          { new: true },
        );
      }

      // falta el cashierSession actualizado
      const cashier = await this.userModel.findById(data.body.cashier);
      const sessionCashier = await this.cashierSessionModel.findById(cashier.cashierSession);
      const updatedCashierSession = {
        phoneOrders: [...sessionCashier.phoneOrders, currentBill._id],
      };

      const cashierSessionUpdated = await this.cashierSessionModel.findByIdAndUpdate(
        sessionCashier._id,
        updatedCashierSession,
      );

      await session.commitTransaction();
      session.endSession();
      return {
        order: phoneOrderUpdated,
        payment: newPayment,
      };
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
    }
  }
  async paymentRappiService(data: { waiterId: string; body: any }) {
    const session = await this.paymentModel.startSession();
    session.startTransaction();
    const currentBill = await this.rappiOrderModel.findById(data.body.accountId);
    if (!currentBill) {
      await session.abortTransaction();
      session.endSession();
      throw new NotFoundException('No se encontro la orden');
    }
    if (currentBill.status === FINISHED_STATUS) {
      await session.abortTransaction();
      session.endSession();
      throw new NotFoundException('La orden no se encuentra en estado de pago');
    }
    try {
      const lastPaymentCode = await this.paymentModel.findOne({}).sort({ createdAt: -1 }).exec();

      const nextPaymentCode = lastPaymentCode
        ? this.getNextPaymentCode(parseFloat(lastPaymentCode.paymentCode))
        : 1;

      const newCode = nextPaymentCode.toString();
      const formatCode = this.formatCode(newCode);

      const branch = await this.branchModel.findById(branchId);
      if (!branch) {
        await session.abortTransaction();
        session.endSession();
        throw new NotFoundException('No se encontro la branch');
      }
      const periodId = branch.operatingPeriod;
      const OperatingPeriod = await this.operatingPeriodModel.findById(periodId);

      // aca debemos pasar el body para crear el pago
      const newPayment = new this.paymentModel({
        ...data.body,
        paymentCode: formatCode,
        operatingPeriod: OperatingPeriod._id,
      });

      // se crea el pago
      await newPayment.save();

      const updatedRappiOrder = {
        payment: [...currentBill.payment, newPayment._id],
        status: FINISHED_STATUS,
      };

      const rappiOrderUpdated = await this.rappiOrderModel.findByIdAndUpdate(
        currentBill._id,
        updatedRappiOrder,
      );

      const tips = newPayment.transactions?.some((element) => element.tips?.length > 0);
      if (tips) {
        await this.userModel.findByIdAndUpdate(
          data.waiterId,
          {
            $push: {
              tips: { $each: newPayment.transactions || [] },
              phoneOrders: currentBill._id,
            },
          },
          { new: true },
        );
      }

      // falta el cashierSession actualizado
      const cashier = await this.userModel.findById(data.body.cashier);
      const sessionCashier = await this.cashierSessionModel.findById(cashier.cashierSession);
      const updatedCashierSession = {
        rappiOrders: [...sessionCashier.rappiOrders, currentBill._id],
      };

      const cashierSessionUpdated = await this.cashierSessionModel.findByIdAndUpdate(
        sessionCashier._id,
        updatedCashierSession,
      );

      await session.commitTransaction();
      session.endSession();
      return {
        order: rappiOrderUpdated,
        payment: newPayment,
      };
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
    }
  }

  ///////////////////////////////////////////////////////////////
  async paymentTips(id: string, body: any) {
    const session = await this.paymentModel.startSession();
    session.startTransaction();

    const currentUser = await this.userModel.findByIdAndUpdate(id, {
      $set: {
        tips: [],
      },
    });
    if (!currentUser) {
      await session.abortTransaction();
      session.endSession();
      throw new NotFoundException('No se encontro el usuario');
    }
    const amount = currentUser?.tips
      ?.filter((tip) => tip.paymentType !== 'cash')
      .reduce((acc, tip) => (isNaN(parseFloat(tip.tips)) ? acc : acc + parseFloat(tip.tips)), 0)
      .toFixed(2);
    const sendData = {
      type: MoneyMovementType.EXPENSE,
      amount: amount,
      date: body.date,
      title: `Pago de propinas - ${currentUser.employeeNumber}`,
      description: body.description,
      user: body.user,
      status: 'pending',
    };

    const res = await this.operatingPeriodService.createMoneyMovement(sendData);
    try {
      await session.commitTransaction();
      session.endSession();
      return res;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.error(error);
    }
  }

  async getCurrentPayments() {
    const session = await this.paymentModel.startSession();
    session.startTransaction();
    try {
      const currentPeriod = await this.operatingPeriodService.getCurrent();
      const currentPeriodId = currentPeriod[0]._id.toString();

      const currentPayments = await this.paymentModel
        .find({
          operatingPeriod: currentPeriodId,
        })
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
        .lean();
      if (!currentPayments) {
        throw new NotFoundException('No se encontro el periodo operativo');
      }
      await session.commitTransaction();
      session.endSession();
      return currentPayments;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }
  private getNextPaymentCode(lastPaymentCode: number): number {
    // Incrementar el billCode actual en 1
    return lastPaymentCode + 1;
  }

  private formatCode(code: string): string {
    return code.padStart(6, '0');
  }

  private addTipsToUser(billCurrent: any, createdPayment: any) {
    const tips = createdPayment.transactions?.some((element) => element.tips?.length > 0);
    if (tips) {
      return this.userModel.findOneAndUpdate(
        { employeeNumber: parseInt(billCurrent.userCode, 10) },
        {
          $push: {
            tips: { $each: createdPayment.transactions || [] },
          },
        },
        { new: true },
      );
    }
  }
}

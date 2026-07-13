import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as cron from 'node-cron';
import { formatToCurrency } from 'src/libs/formatToCurrency';
import { FREE_STATUS } from 'src/libs/status.libs';
import { OperatingPeriodService } from 'src/operating-period/operating-period.service';
import { Branch } from 'src/schemas/business/branchSchema';
import { OperatingPeriod } from 'src/schemas/operatingPeriod/operatingPeriod.schema';
import { SourcePeriod } from 'src/schemas/SourcePeriod/sourcePeriod.schema';
import { Table } from 'src/schemas/tables/tableSchema';
import { User } from 'src/schemas/users.schema';
import { Bills } from '@schema/sales/bills.schema';
import { Notes } from 'src/schemas/ventas/notes.schema';
import { PhoneOrder } from 'src/schemas/ventas/orders/phoneOrder.schema';
import { RappiOrder } from 'src/schemas/ventas/orders/rappiOrder.schema';
import { ToGoOrder } from 'src/schemas/ventas/orders/toGoOrder.schema';
import { SendMessagesService } from 'src/send-messages/send-messages.service';
import { BillsCounter } from 'src/schemas/counters/billsCounter.schema';

@Injectable()
export class CronService {
  constructor(
    @InjectModel(OperatingPeriod.name)
    private operatingPeriodModel: Model<OperatingPeriod>,
    @InjectModel(User.name)
    private userModel: Model<User>,
    @InjectModel(Bills.name) private billsModel: Model<Bills>,
    @InjectModel(SourcePeriod.name)
    private sourcePeriodModel: Model<SourcePeriod>,
    @InjectModel(Notes.name) private notesModel: Model<Notes>,
    @InjectModel(Table.name) private tableModel: Model<Table>,
    @InjectModel(Branch.name) private branchModel: Model<Branch>,
    @InjectModel(ToGoOrder.name) private toGoOrderModel: Model<ToGoOrder>,
    @InjectModel(RappiOrder.name) private rappiOrderModel: Model<RappiOrder>,
    @InjectModel(PhoneOrder.name) private phoneOrderModel: Model<PhoneOrder>,
    private readonly operatingPeriodService: OperatingPeriodService,
    private readonly sendMessageService: SendMessagesService,
    @InjectModel(BillsCounter.name) private billCounterModel: Model<BillsCounter>
  ) {
    this.initializeCronJobs();
  }

  async initializeCronJobs() {
    /* //////////////////////////////////////////////////////////
    /////  METODOS PARA EJECUTAR CRON JOBS AL INICIAR EL DIA ////
    ////////////////////////////////////////////////////////// */
    const branchId = '66bd36e5a107f6584ef54dca';
    const branch = await this.branchModel.findById(branchId);
    if (!branch) {
      throw new Error('No se encontro la branch');
    }

    const { initOperatingPeriod } = branch;

    const [openingHour, openingMinute] = initOperatingPeriod
      .split(':')
      .map((num) => parseInt(num, 10));

    // Validación de horas y minutos
    if (
      isNaN(openingHour) ||
      isNaN(openingMinute) ||
      openingHour < 0 ||
      openingHour > 23 ||
      openingMinute < 0 ||
      openingMinute > 59
    ) {
      console.log('Formato de hora/minuto inválido en la sucursal');
      return;
    }
    // Programa el cron job para iniciar el período operativo
    const startCronExpression = `${openingMinute} ${openingHour} * * *`;

    cron.schedule(startCronExpression, async () => {
      ///////////////////////////////////////////////////////////////////
      // Aquí se cierra el actual periodo operativo actual //////////////
      ///////////////////////////////////////////////////////////////////
      const currentPeriodId = branch.operatingPeriod;
      await this.sendMessageService.SendTelegramMessage(
        ` Este es el periodo actual: ${currentPeriodId}`,
      );

      if (currentPeriodId) {
        const updatedPeriod = await this.operatingPeriodService.closePeriod(
          currentPeriodId.toString(),
        );

        if (!updatedPeriod) {
          console.error('No se pudo cerrar el periodo operativo');
        }

        const debugCloseperiodReturn =
          '🛠️ Cierre de periodo completado.\n\n' +
          `➡️ Estado del periodo: ${updatedPeriod.state}\n` +
          `💰 Venta total registrada: $${formatToCurrency(updatedPeriod.totalSellsAmount) || '0.00'}\n\n` +
          `➡️ Venta en restaurante: $${formatToCurrency(updatedPeriod.totalRestaurantAmount)} en ${updatedPeriod.restaurantOrdersTotal} cuentas.\n` +
          `➡️ Ventas para llevar: $${formatToCurrency(updatedPeriod.totalToGoOrdersAmount)} en ${updatedPeriod.togoOrdersTotal} cuentas.\n` +
          `➡️ Ventas por telefono: $${formatToCurrency(updatedPeriod.totalPhoneAmount)} en ${updatedPeriod.phoneOrdersTotal}, cuentas.\n` +
          `➡️ Ventas rappi: $${formatToCurrency(updatedPeriod.totalRappiAmount)} en ${updatedPeriod.rappiOrdersTotal} cuentas.\n` +
          `➡️ Efectivo total: $${formatToCurrency(updatedPeriod.totalCashInAmount)}\n` +
          `➡️ Total en tarjeta de debito $${formatToCurrency(updatedPeriod.totalDebitAmount)}\n` +
          `➡️ Total en tarjeta de credito $${formatToCurrency(updatedPeriod.totalCreditAmount)}\n` +
          `➡️ Total en transferencias $${formatToCurrency(updatedPeriod.totalTransferAmount)}\n` +
          `➡️ Numero de comensales: $${formatToCurrency(updatedPeriod.totalDiners)}\n` +
          `➡️ Ingresos: $${formatToCurrency(updatedPeriod.balanceSheet.totalIncome)}\n` +
          `➡️ Egresos: $${formatToCurrency(updatedPeriod.balanceSheet.totalExpense)}\n` +
          `➡️ Saldo: $${formatToCurrency(updatedPeriod.balanceSheet.balanceSheet)}\n` +
          'Si todo funciona correctamente, estos valores deberían reflejarse con precisión.';

        await this.sendMessageService.SendTelegramMessage(debugCloseperiodReturn);
      }
      ////////////////////////////////////////////////////////////////////
      // Aquí se crea el nuevo periodo operativo /////////////////////////
      ////////////////////////////////////////////////////////////////////
      const session = await this.branchModel.startSession();
      session.startTransaction();
      await this.sendMessageService.SendTelegramMessage(
        ` Aqui se inicia la transaccion para actualizar la sucursal`,
      );

      try {
        const newOperatingPeriod = new this.operatingPeriodModel();
        await newOperatingPeriod.save();
        if (!newOperatingPeriod) {
          await session.abortTransaction();
          session.endSession();
          throw new Error('No se pudo crear el nuevo periodo operativo');
        }

        await this.sendMessageService.SendTelegramMessage(
          `El nuevo periodo se creo y tiene el id: ${newOperatingPeriod}`,
        );

        // vamos a actualizar la branch en su key operatingperiod si no hay ninguno metemos el nuevo y hay ya hay uno lo reemplazamos
        const updatedBranch = await this.branchModel.findByIdAndUpdate(branchId, {
          operatingPeriod: newOperatingPeriod._id,
        });
        if (!updatedBranch) {
          const debugCloseperiodReturn = 'No se pudo actualizar el ID de la sucursal';

          await this.sendMessageService.SendTelegramMessage(debugCloseperiodReturn);
          await session.abortTransaction();
          session.endSession();
          throw new Error('No se pudo actualizar la branch');
        }

        await this.sendMessageService.SendTelegramMessage(
          `Se actualizo la sucursal con el nuevo periodo operativo que es ${updatedBranch.operatingPeriod}`,
        );

        const UserUpdated = await this.userModel.updateMany(
          {},
          { $set: { cashierSession: null, dailyRegister: null, togoorders: [], rappiOrders: [] } },
        );
        if (!UserUpdated) {
          await session.abortTransaction();
          session.endSession();
          throw new Error('No se pudieron actualizar los usuarios');
        }
        await this.billCounterModel.findOneAndUpdate(
          { $set: { restaurantCounter: 1, togoCounter: 1 } },
        );

        const tableUpdated = await this.tableModel.updateMany(
          {},
          {
            $set: {
              status: FREE_STATUS,
              bill: [],
              availability: true,
              joinedTables: [],
              diners: 1,
              active: true,
            },
          },
        );

        if (!tableUpdated) {
          await session.abortTransaction();
          session.endSession();
          throw new Error('No se pudieron actualizar las mesas');
        }
        await session.commitTransaction();
        session.endSession();
      } catch (error) {
        const debugCloseperiodReturn = 'Entre al error del catch';

        await this.sendMessageService.SendTelegramMessage(debugCloseperiodReturn);
        await session.abortTransaction();
      } finally {
        session.endSession();
      }
    });

    /*
    // Programa el cron job para finalizar el período operativo
    const endCronExpression = `${closingMinute} ${closingHour} * * *`;
    cron.schedule(endCronExpression, async () => {
      const session = await this.branchModel.startSession();
      session.startTransaction();
      try {
        // Lógica para manejar el fin del período operativo
        const currentPeriod = this.operatingPeriodService.getCurrent();
        if (!currentPeriod) {
          throw new Error('No se encontro el periodo operativo actual');
        }
        // Aquí podrías, por ejemplo, actualizar el estado de la sucursal en la base de datos

        await session.commitTransaction();
      } catch (error) {
        await session.abortTransaction();
      } finally {
        session.endSession();
      }
    });
    */
  }

  async closeManualPeriod(body: any) {
    const session = await this.operatingPeriodModel.startSession();
    session.startTransaction();
    try {
      const currentPeriod = await this.operatingPeriodService.getCurrent(body.period);
      const currentPeriodId = currentPeriod[0]._id.toString();
      // const updatedPeriod = await this.operatingPeriodService.closePeriod(
      //   currentPeriodId.toString(),
      // );
      // if (!updatedPeriod) {
      //   throw new Error('No se pudo cerrar el periodo operativo');
      // }

      const updatedPeriod = await this.operatingPeriodService.closePeriod(
        currentPeriodId.toString(),
      );

      if (!updatedPeriod) {
        console.error('No se pudo cerrar el periodo operativo');
      }
      await session.commitTransaction();
      session.endSession();
      return updatedPeriod;
    } catch (error) {
      console.log(error);
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }

  async createSourcePeriod(data: any, branchId: string, date: string) {
    const session = await this.sourcePeriodModel.startSession();
    session.startTransaction();

    const newSourceData = {
      branchId,
      periodDate: date,
      accounts: data,
    };
    try {
      const newSourcePeriod = new this.sourcePeriodModel(newSourceData);
      await newSourcePeriod.save();
      if (!newSourcePeriod) {
        await session.abortTransaction();
        session.endSession();
        throw new Error('No se pudo crear el periodo de fuente');
      }
      return newSourcePeriod;
    } catch (error) {
      console.log(error);
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }

  async createPeriodForBranch() {
    try {
      const newOperatingPeriod = new this.operatingPeriodModel();
      await newOperatingPeriod.save();
      if (!newOperatingPeriod) {
        throw new Error('No se pudo crear el nuevo periodo operativo');
      }
      const branchId = '66bd36e5a107f6584ef54dca';

      // vamos a actualizar la branch en su key operatingperiod si no hay ninguno metemos el nuevo y hay ya hay uno lo reemplazamos
      const updatedBranch = await this.branchModel.findByIdAndUpdate(branchId, {
        operatingPeriod: newOperatingPeriod._id,
      });
    } catch (error) {
      throw new NotFoundException('No se pudo crear el nuevo periodo operativo');
    }
  }
}

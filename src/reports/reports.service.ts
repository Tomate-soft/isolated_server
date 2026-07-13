import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CashierSession } from 'src/schemas/cashierSession/cashierSession';
import { spawn } from 'child_process';
import { join } from 'path';
import * as fs from 'fs/promises';
// update
import { format, getISOWeek, startOfWeek } from 'date-fns';
import { BillsService } from 'src/ventas/bills/bills.service';
import { FINISHED_STATUS } from 'src/libs/status.libs';
import { User } from 'src/schemas/users.schema';
import { calculateTempo } from './lib/calculateTimes';
import { OperatingPeriodService } from 'src/operating-period/operating-period.service';
//import { ProcessService } from 'src/process/process.service';

@Injectable()
export class ReportsService {
  constructor(
    @InjectModel(CashierSession.name)
    private cashierSessionModel: Model<CashierSession>,
    @InjectModel(User.name) private usersModel: Model<User>,
    private billService: BillsService,
    private operatingPeriodService: OperatingPeriodService,
  ) {}

  private async ensureReportsFolderExists(folderPath: string) {
    try {
      await fs.access(folderPath); // Verifica si la carpeta existe
    } catch (error) {
      await fs.mkdir(folderPath, { recursive: true }); // Crea la carpeta si no existe
    }
  }

  private async getWeekFolderName() {
    const today = new Date();
    const weekStart = startOfWeek(today);
    const weekNumber = getISOWeek(today);
    const formattedDate = format(weekStart, 'yyyy-MM-dd'); // Formato para nombre de carpeta
    return `Week-${weekNumber}_${formattedDate}`;
  }

  async printClosedBillsReport() {
    try {
      const period = await this.operatingPeriodService.getCurrent();
      const { createdAt } = period[0];
      const date = new Date(createdAt)
        .toLocaleString('es-ES', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        })
        .replace(/\/$/, '');

      const BillsArray = await this.billService.findCurrent();
      const finishedBills = BillsArray.filter((bill) => bill.status === FINISHED_STATUS);

      const finishedBillsRestaurant = finishedBills.filter(
        (bill) =>
          bill.sellType === 'ON_SITE_ORDER' ||
          bill.sellType === 'onSite' ||
          bill.sellType === 'n/A',
      );
      const restaurantTotal = this.calculateSellTotalForType(finishedBillsRestaurant);

      const finishedBillsTogo = finishedBills.filter(
        (bill) =>
          bill.sellType === 'TOGO_ORDER' || bill.sellType === 'togo' || bill.sellType === 'n/A',
      );
      const togoTotal = this.calculateSellTotalForType(finishedBillsTogo);

      const finishedBillsPhone = finishedBills.filter(
        (bill) =>
          bill.sellType === 'PHONE_ORDER' || bill.sellType === 'phone' || bill.sellType === 'n/A',
      );
      const phoneTotal = this.calculateSellTotalForType(finishedBillsPhone);

      const finishedBillsRappi = finishedBills.filter(
        (bill) =>
          bill.sellType === 'RAPPI_ORDER' || bill.sellType === 'rappi' || bill.sellType === 'n/A',
      );
      const rappiTotal = this.calculateSellTotalForType(finishedBillsRappi);

      const responseData = {
        restaurantOrders: finishedBillsRestaurant,
        restaurantTotal: restaurantTotal,
        togoOrders: finishedBillsTogo,
        togoTotal: togoTotal,
        phoneOrders: finishedBillsPhone,
        phoneTotal: phoneTotal,
        rappiOrders: finishedBillsRappi,
        rappiTotal: rappiTotal,
        period: date,
      };
      const exampleBody = {
        products: [
          {
            quantity: 2,
            prices: [
              {
                name: 'product1',
                price: 10,
              },
            ],
          },
        ],
        discount: {
          discountMount: '20',
          setting: 'SET_PERCENT',
        },
        functionName: 'calculateProductTotal',
      };
      //const exampleBodyJson = JSON.stringify(exampleBody);
      /*////////////////////////////////////////////////////////////////////////*/
      // /////////////Aca la logica de calcular con el archivo externo /////////*/
      // /////////////////////////////////////////////////////////////////////// */
      // const result = await this.runCalculoExe(exampleBodyJson);

      ////////////////////////////////////////////////////////////////////////////////////
      ////////////////////////////////////////////////////////////////////////////////////
      /////////////////////////////////////////////////////////////////////////////////////
      // por ejemplo tener un. exe aca que me haga todos los calculos y que siga el servicio despues
      return responseData;
    } catch (error) {
      throw new NotFoundException(error);
    }
  }

  private async runCalculoExe(inputJson: string): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        // Parseamos el JSON recibido
        const parsedBody = JSON.parse(inputJson);

        // Extraemos los parámetros necesarios desde el JSON
        const products = JSON.stringify(parsedBody.products); // Ejemplo de extraer productos
        const discount = JSON.stringify(parsedBody.discount); // Ejemplo de extraer descuento
        const functionName = parsedBody.functionName; // Ejemplo de extraer nombre de función

        // Ahora, pasamos los parámetros como argumentos al ejecutable
        const exePath = join(__dirname, 'bin', 'calculo.exe');
        console.log('Ruta al ejecutable:', exePath); // Verifica la ruta generada
        const process = spawn(exePath, [products, discount, functionName]);

        let output = '';
        let errorOutput = '';

        // Capturamos la salida estándar del ejecutable
        process.stdout.on('data', (data) => {
          output += data.toString(); // Acumulamos la salida
        });

        // Capturamos los errores del ejecutable
        process.stderr.on('data', (data) => {
          errorOutput += data.toString(); // Acumulamos los errores
        });

        // Capturamos el cierre del proceso
        process.on('close', (code) => {
          if (code === 0) {
            resolve(output); // Si todo va bien, resolvemos con la salida
          } else {
            reject(new Error(`El proceso terminó con el código ${code}: ${errorOutput}`)); // Si hay un error, rechazamos
          }
        });
      } catch (error) {
        reject(new Error('Error al procesar el JSON o ejecutar el calculo'));
      }
    });
  }

  async printWorkedTimeReport(id?: string) {
    const workUsers = [];
    const currentPeriod = await this.operatingPeriodService.getCurrent(id);
    const registers = currentPeriod[0].dailyRegisters;

    const period = id ? await this.getShortPeriodDate(id) : await this.getShortPeriodDate();

    registers.forEach((register) => {
      const { firstTime, secondTime, thirdTime, fourthTime, userId } = register;
      const { name, lastName, employeeNumber } = userId;

      workUsers.push({
        employeeNumber, // 👈 lo guardamos también para ordenar
        user: `${name} ${lastName}`,
        firstTime: firstTime?.slice(0, 5) || '--',
        secondTime: secondTime?.slice(0, 5) || '--',
        thirdTime: thirdTime?.slice(0, 5) || '--',
        fourthTime: fourthTime?.slice(0, 5) || '--',
        workedTime: calculateTempo(register),
      });
    });

    // 🔥 Ordenar por employeeNumber numéricamente
    workUsers.sort((a, b) => Number(a.employeeNumber) - Number(b.employeeNumber));

    return {
      workData: workUsers,
      period,
    };
  }

  // async printWorkedTimeReport(id?: string) {
  //   const workUsers = [];
  //   const currentPeriod = await this.operatingPeriodService.getCurrent(id);
  //   const registers = currentPeriod[0].dailyRegisters;

  //   const period = id
  //     ? await this.getShortPeriodDate(id)
  //     : await this.getShortPeriodDate();

  //   registers.forEach((register) => {
  //     const { firstTime, secondTime, thirdTime, fourthTime, userId } = register;
  //     const { name, lastName, employeeNumber } = userId;
  //     workUsers.push({
  //       user: `${employeeNumber} ${name} ${lastName}`,
  //       firstTime: firstTime?.slice(0, 5) || '--',
  //       secondTime: secondTime?.slice(0, 5) || '--',
  //       thirdTime: thirdTime?.slice(0, 5) || '--',
  //       fourthTime: fourthTime?.slice(0, 5) || '--',
  //       workedTime: calculateTempo(register),
  //     });
  //   });

  //   return {
  //     workData: workUsers,
  //     period,
  //   };
  // }

  private async getShortPeriodDate(id?: string) {
    const period = id
      ? await this.operatingPeriodService.getCurrent(id)
      : await this.operatingPeriodService.getCurrent();
    const { createdAt } = period[0];
    const date = new Date(createdAt)
      .toLocaleString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
      .replace(/\/$/, '');
    return date;
  }

  private calculateSellTotalForType(sellArray) {
    // Flatten payments from the sell array, filtering out any undefined elements
    const allPayments = sellArray.flatMap((element) => {
      return element?.payment || [];
    });

    // Flatten transactions from the payments, filtering out any undefined elements
    const allTransactions = allPayments.flatMap((element) => {
      return element?.transactions || [];
    });

    // Sum the payQuantity of all transactions, converting to a float
    const responseData = allTransactions.reduce((accumulator, transaction) => {
      return accumulator + parseFloat(transaction.payQuantity || '0');
    }, 0);
    return responseData;
  }
}

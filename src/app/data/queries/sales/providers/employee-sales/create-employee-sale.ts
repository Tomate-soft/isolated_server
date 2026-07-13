import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { EmployeeOrder } from '@schema/sales/employee-order.schema';
import { ClientSession, Connection, Model } from 'mongoose';
import { Branch } from 'src/schemas/business/branchSchema';
import { BillsCounter } from 'src/schemas/counters/billsCounter.schema';
import { branchId } from 'src/variablesProvisionales';
import { InternProduct } from 'src/ventas/orders/togo-order/types';

@Injectable()
export class CreateEmployeeSale {
  constructor(
    @InjectModel(EmployeeOrder.name) private readonly employeeOrderModel: Model<EmployeeOrder>,
    @InjectConnection() private readonly connection: Connection,
    @InjectModel(BillsCounter.name) private readonly billsCounterModel: Model<BillsCounter>,
    @InjectModel(Branch.name) private readonly branchModel: Model<Branch>,
  ) {}

  async CreateEmployeeSale(body: any): Promise<any> {
    let res: any = null;
    await this.connection.transaction(async (session: ClientSession) => {
      const code = await this.getCodeFromCounter(session);
      const formatProducts = body.products.map((product: InternProduct) => {
        const prod = { ...product };
        prod.active = true;
        return prod;
      });

      // new update
      const branch = await this.branchModel.findById(branchId).select('operatingPeriod').lean();

      const orderData = {
        ...body,
        code: code,
        products: formatProducts,
        operatingPeriod: branch?.operatingPeriod,
      };

      const newOrder = new this.employeeOrderModel(orderData);
      await newOrder.save({ session });
      res = this.__responseAdapter(newOrder);
    });
    return res;
  }

  private async getCodeFromCounter(session: ClientSession): Promise<string> {
    const MAX = 999999;

    let counter = await this.billsCounterModel.findOne().session(session);

    if (!counter) {
      counter = new this.billsCounterModel({ togoCounter: 1 });
    } else {
      counter.togoCounter = (counter.togoCounter ?? 0) + 1;
      if (counter.togoCounter > MAX) {
        counter.togoCounter = 1;
      }
    }
    await counter.save({ session });
    return counter.togoCounter.toString().padStart(6, '0');
  }
  private __bodyAdapter(body: any): any {
    // Aquí puedes adaptar el cuerpo según sea necesario
    return body;
  }

  private __responseAdapter(response: EmployeeOrder): any {
    const { orderName, user, products } = response;

    const adaptedResponse = {
      orderName,
      user,
      products,
      // products: products.map(product => ({
      //   name: product.productName,
      //   quantity: product.quantity,
      //   price: product.price,
      // })),
    };
    return adaptedResponse;
  }
}

import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Bills } from '@schema/sales/bills.schema';
import { ClientSession, Connection, Model } from 'mongoose';
import { ENABLE_STATUS, FOR_PAYMENT_STATUS } from 'src/libs/status.libs';
import { Table } from 'src/schemas/tables/tableSchema';
import { User } from 'src/schemas/users.schema';
import { Payment } from 'src/schemas/ventas/payment.schema';

interface CheckOsiteOrderBody {
  status: string;
  products?: any[];
  checkTotal?: string;
}

@Injectable()
export class CheckOrdersQuery {
  constructor(
    @InjectModel(Bills.name) private billsModel: Model<Bills>,
    @InjectModel(Payment.name) private paymentModel: Model<Payment>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Table.name) private tableModel: Model<Table>,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  async checkOrders(id: string, body: CheckOsiteOrderBody): Promise<any> {
    await this.connection.transaction(async (session: ClientSession) => {
      const order = await this.billsModel.findOneAndUpdate(
        { _id: id, status: { $ne: ENABLE_STATUS } },
        { $set: { status: FOR_PAYMENT_STATUS, checkTotal: body.checkTotal } },
        { new: true, session },
      );

      const table = await this.tableModel.findByIdAndUpdate(
        order.table,
        { status: FOR_PAYMENT_STATUS },
        { new: true, session },
      );

      // ocupamos ver las sessiones de caja para ver a quien se la asignamos
    });
  }
}

// procesos que se necesitan
// 1.a barra tables -- este hay que revisarlo
// 2.se manda  aimprimir la comanda pero esto no es aqui
// 3.se mnada a imporimir el ticket por pagar que tmpoco e snecsario aca
// 4. PUT a /bills/:id
/*
cambiando el status de la cuenta
el total
y los productos

 esto retorno la cuenta
 hay que ver que nos combien eretornar dependiendo
 si ocupamos esta data para imprimir el ticket o no
*/

// 5. PUT a /tables/:id para cambiar el status de la mesa

//6. a /cashier-session/payment/:id
/*
    yo supongo que setea a un cajero la cuenta
*/

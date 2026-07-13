import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Bills } from '@schema/sales/bills.schema';
import { ClientSession, Connection, Model } from 'mongoose';
import { ENABLE_STATUS, FREE_STATUS } from 'src/libs/status.libs';
import { Table } from 'src/schemas/tables/tableSchema';
import { User } from 'src/schemas/users.schema';

interface TransferTableForUserBody {
  sender_data: {
    userId: string;
    tableId: string;
  };
  addressee_data: {
    userId: string;
    tableId: string;
  };
}

@Injectable()
export class TransferTableForUser {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Bills.name) private billsModel: Model<Bills>,
    @InjectModel(Table.name) private tableModel: Model<Table>,
    @InjectConnection() private readonly session: Connection,
  ) {}

  async transferTableForUser(id: string, body: TransferTableForUserBody) {
    console.log(body);
    let message: string;
    await this.session.transaction(async (session: ClientSession) => {
      const [senderUser, addresseeUser, senderTable, addresseeTable] = await Promise.all([
        this.userModel.findOne({ _id: body.sender_data.userId }).session(session).exec(),
        this.userModel.findOne({ _id: body.addressee_data.userId }).session(session).exec(),
        // this.billsModel.findById(id).populate('payment').session(session).exec(),
        this.tableModel.findById(body.sender_data.tableId).populate('bill').session(session).exec(),
        this.tableModel
          .findById(body.addressee_data.tableId)
          .populate('bill')
          .session(session)
          .exec(),
      ]);

      // const senderUserNewData = { $set: { } } // Datos que se van a actualizar del usuario que manda
      // const addresseeUserNewData = { $set: { } } // Datos que se van a actualizar del usuario que recibe
      const senderTableNewData = { $set: { bill: [], status: FREE_STATUS } }; // Datos que se van a actualizar de la mesa del usuario que manda
      const addresseeTableNewData = { $push: { bill: id }, $set: { status: ENABLE_STATUS } }; // Datos que se van a actualizar de la mesa del usuario que recibe
      const currentBillNewData = {
        $set: {
          user: ` ${addresseeUser.name} ${addresseeUser.lastName}`,
          userCode: `${addresseeUser.employeeNumber}`,
          userId: addresseeUser._id,
          tableNum: addresseeTable.tableNum,
          table: addresseeTable._id,
        },
      }; // Datos que se van a actualizar de la cuenta que se transfiere

      await this.session.transaction(async (session: ClientSession) => {
        const [senderUser, addresseeUser, currentBill /*, senderTable, addresseeTable */] =
          await Promise.all([
            // this.userModel.findByIdAndUpdate(body.sender_data.userId, senderUserNewData, { session }).exec(), // usuario que manda
            // this.userModel.findByIdAndUpdate(body.addressee_data.userId, addresseeUserNewData, { session }).exec(), // usuario que recibe
            this.billsModel.findByIdAndUpdate(id, currentBillNewData, { session }).exec(), // cuenta que se transfiere
            this.tableModel
              .findByIdAndUpdate(body.sender_data.tableId, senderTableNewData, { session })
              .exec(), // mesa del usuario que manda
            this.tableModel
              .findByIdAndUpdate(body.addressee_data.tableId, addresseeTableNewData, { session })
              .exec(), // mesa del usuario que recibe
          ]);
      });
    });
    return { message };
  }
}

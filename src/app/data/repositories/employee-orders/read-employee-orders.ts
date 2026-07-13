import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { EmployeeOrder } from '@schema/sales/employee-order.schema';
import { Model } from 'mongoose';

@Injectable()
export class ReadEmployeeOrders {
  constructor(@InjectModel(EmployeeOrder.name) private employeeOrderModel: Model<EmployeeOrder>) {}

  findAllForReport(id: string) {
    const response = this.employeeOrderModel.find({ operatingPeriod: id });
    return response;
  }
}

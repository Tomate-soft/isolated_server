import { Injectable} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
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
  }

}

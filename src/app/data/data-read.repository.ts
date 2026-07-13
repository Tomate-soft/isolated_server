import { Injectable } from '@nestjs/common';
import { ReadBillsRepository } from './repositories/bills/read-bills.repository';
import { ReadPaymentsRepository } from './repositories/payments/read-payments.repository';
import { ReadOperatingPeriodsRepository } from './repositories/operating-periods/read-operatingPeriods.repository';
import { ReadRewritedPeriods } from './repositories/rewrited-period/read-rewrited-periods';
import { ReadSubcategoriesRepository } from './repositories/subcategories/read-subcategories.repository';
import { ReadEmployeeOrders } from './repositories/employee-orders/read-employee-orders';

@Injectable()
export class ReadDataRepository {
  constructor(
    public readonly readBillsRepository: ReadBillsRepository,
    public readonly readPaymentsRepository: ReadPaymentsRepository,
    public readonly readOperatingPeriodsRepository: ReadOperatingPeriodsRepository,
    public readonly readRewritedPeriodsRepository: ReadRewritedPeriods,
    public readonly readSubcategoriesRepository: ReadSubcategoriesRepository,
    public readonly readEmployeeOrdersRepository: ReadEmployeeOrders,
  ) {}
}

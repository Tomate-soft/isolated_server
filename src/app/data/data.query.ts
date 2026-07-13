import { Injectable } from '@nestjs/common';
import { ClosuresQuery } from './queries/closures/closures.query';
import { CancellationsQuery } from './queries/cancelations/cancellations-query';
import { PaymentsQueries } from './queries/payments/providers/payments-queries';
import { TransferTableForUser } from './queries/operations/providers/transfer-table-for-user';
import { EmployeeSalesQuery } from './queries/sales/providers/employee-sales/employee-sales-query';
import { GetProductSales } from './queries/reports/provider/sales/get-product-sales';
import { ReportsQueries } from './queries/reports/reports-queries';
import { WaitlistRegister } from './queries/checkin/waitlist-register/waitlist-register';

@Injectable()
export class DataQuery {
  constructor(
    public readonly closures: ClosuresQuery,
    public readonly cancellationsQuery: CancellationsQuery,
    public readonly paymentsQuery: PaymentsQueries,
    public readonly transferTableForUser: TransferTableForUser,
    public readonly salesQuery: EmployeeSalesQuery,
    public readonly productSalesQuery: GetProductSales,
    public readonly reportsQuery: ReportsQueries,
    public readonly waitlistRegister: WaitlistRegister,
  ) {}
}

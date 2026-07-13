import { Module } from '@nestjs/common';
import { ClosuresQuery } from './closures/closures.query';
import { DailyClousureQuery } from './closures/daily-clousure.query';
import { MongooseModule } from '@nestjs/mongoose';
import {
  OperatingPeriod,
  OperatingPeriodSchema,
} from 'src/schemas/operatingPeriod/operatingPeriod.schema';
import { CancellationsQuery } from './cancelations/cancellations-query';
import { CancelTogoQuery } from './cancelations/providers/cancel-togo-query';
import { CancelRappiQuery } from './cancelations/providers/cancel-rappi-query';
import { CancelPhoneQuery } from './cancelations/providers/cancel-phone-query';
import { CancelOnsiteQuery } from './cancelations/providers/cancel-onsite-query';
import { OrderCancel, OrderCancelSchema } from '@schema/cancellations/order-cancel.schema';
import { ToGoOrder, ToGoOrderSchema } from 'src/schemas/ventas/orders/toGoOrder.schema';
import { RappiOrder, RappiOrderSchema } from 'src/schemas/ventas/orders/rappiOrder.schema';
import { PhoneOrder, PhoneOrderSchema } from 'src/schemas/ventas/orders/phoneOrder.schema';
import { Bills, BillSchema } from '@schema/sales/bills.schema';
import { Table, TableSchema } from 'src/schemas/tables/tableSchema';
import { PaymentsQueries } from './payments/providers/payments-queries';
import { PayOnsiteQueries } from './payments/providers/pay-onsite-queries';
import { User, UserSchema } from 'src/schemas/users.schema';
import { Payment, PaymentSchema } from 'src/schemas/ventas/payment.schema';
import { PayWithCourtesies } from './payments/providers/pay-with-courtesies';
import { Discount, DiscountSchema } from 'src/schemas/ventas/discounts.schema';
import { OrderCourtesy, OrderCourtesySchema } from '@schema/courtesies/oder-courtesy';
import { PayTogoQueries } from './payments/providers/pay-togo-queries';
import { PayRappiQueries } from './payments/providers/pay-rappi-queries';
import { PayPhoneQueries } from './payments/providers/pay-phone-queries';
import { Notes, NoteSchema } from 'src/schemas/ventas/notes.schema';
import { TransferTableForUser } from './operations/providers/transfer-table-for-user';
import { CheckOrdersQuery } from './payments/providers/check-orders-query';
import { EmployeeSalesQuery } from './sales/providers/employee-sales/employee-sales-query';
import { EmployeeOrder, EmployeeOrderSchema } from '@schema/sales/employee-order.schema';
import { BillsCounter, BillsCounterSchema } from 'src/schemas/counters/billsCounter.schema';
import { CreateEmployeeSale } from './sales/providers/employee-sales/create-employee-sale';
import { GetProductSales } from './reports/provider/sales/get-product-sales';
import { Branch, BranchSchema } from 'src/schemas/business/branchSchema';
import { TotalCancelsReport } from './reports/provider/cancellations/total-cancels-report/total-cancels-report';
import { ReportsQueries } from './reports/reports-queries';
import { CancellationReasonSchema } from 'src/schemas/ventas/cancellationReason.schema';
import { Cancellations } from 'src/schemas/ventas/cancellations.schema';
import { SelltypeUserSales } from './reports/provider/sales/selltype-user-sales';
import { CourtesiesDetailsByPeriod } from './reports/provider/courtesies/courtesies-details-by-period';
import { TillCousureQuery } from './closures/till-cousure-query';
import { OrderAttentionTime } from './reports/provider/time/order-attention-time';
import { WaitlistRegister } from './checkin/waitlist-register/waitlist-register';
import { TableManagement } from './checkin/table-management/table-management';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: OperatingPeriod.name, schema: OperatingPeriodSchema },
      { name: OrderCancel.name, schema: OrderCancelSchema },
      { name: Cancellations.name, schema: CancellationReasonSchema },
      { name: ToGoOrder.name, schema: ToGoOrderSchema },
      { name: RappiOrder.name, schema: RappiOrderSchema },
      { name: PhoneOrder.name, schema: PhoneOrderSchema },
      { name: Bills.name, schema: BillSchema },
      { name: Notes.name, schema: NoteSchema },
      { name: Table.name, schema: TableSchema },
      { name: User.name, schema: UserSchema },
      { name: Payment.name, schema: PaymentSchema },
      { name: Discount.name, schema: DiscountSchema },
      { name: OrderCourtesy.name, schema: OrderCourtesySchema },
      { name: EmployeeOrder.name, schema: EmployeeOrderSchema },
      { name: BillsCounter.name, schema: BillsCounterSchema },
      { name: Branch.name, schema: BranchSchema },
    ]),
  ],
  providers: [
    ClosuresQuery,
    DailyClousureQuery,
    CancellationsQuery,
    CancelTogoQuery,
    CancelRappiQuery,
    CancelPhoneQuery,
    CancelOnsiteQuery,
    PaymentsQueries,
    PayOnsiteQueries,
    PayWithCourtesies,
    PayTogoQueries,
    PayRappiQueries,
    PayPhoneQueries,
    TransferTableForUser,
    CheckOrdersQuery,
    EmployeeSalesQuery,
    CreateEmployeeSale,
    GetProductSales,
    TotalCancelsReport,
    ReportsQueries,
    SelltypeUserSales,
    CourtesiesDetailsByPeriod,
    TillCousureQuery,
    OrderAttentionTime,
    WaitlistRegister,
    TableManagement,
  ],
  exports: [
    ClosuresQuery,
    DailyClousureQuery,
    CancellationsQuery,
    PaymentsQueries,
    TransferTableForUser,
    EmployeeSalesQuery,
    GetProductSales,
    ReportsQueries,
    WaitlistRegister,
  ],
})
export class QueriesModule {}

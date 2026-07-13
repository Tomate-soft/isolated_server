import { Module } from '@nestjs/common';
import { ReportsController } from './controllers/reports.controller';
import { ReportsService } from './services/reports.service';
import { DataModule } from 'src/app/data/data.module';
import { PeriodIntegration } from './integrations/period-integration';
import { ReportsIntegrations } from './integrations/integrations';
import { TipsService } from './services/tips/tips.service';
import { DailyTipsReportsService } from './services/tips/daily-tips-reports.service';
import { ProductSalesIntegrations } from './integrations/product-sales-integrations';
import { ProductSalesController } from './controllers/sales/product-sales.controller';
import { ProductSalesService } from './services/sales/product-sales.service';
import { SalesService } from './services/sales/sales.service';
import { OrderReportsController } from './controllers/orders/order-reports.controller';
import { EmployeeOrdersIntegrations } from './integrations/employee-orders-integrations';
import { OrdersService } from './services/orders/orders.service';
import { EmployeeOrdersService } from './services/orders/employee-orders.service';
import { CancelsIntegration } from './integrations/cancels-integration';
import { CancellationsService } from './services/cancellations/cancellations.service';
import { OrderCancellationsService } from './services/cancellations/order-cancellations.service';
import { CancellationController } from './controllers/cancellations/cancellation/cancellation.controller';
import { ProductsCancellationService } from './services/cancellations/products-cancellation.service';
import { SalesIntegration } from './integrations/sales-integration';
import { CourtesiesIntegration } from './integrations/courtesies-integration';
import { CoutesiesService } from './services/courtesies/courtesies.service';
import { GetPeriodCourtesiesService } from './services/courtesies/get-period-courtesies.service';
import { CoutesiesController } from './controllers/courtesies/coutesies.controller';
import { GetProductCourtesiesService } from './services/courtesies/get-product-courtesies.service';
import { TimeIntegration } from './integrations/time-integration';
import { TimeService } from './services/time/time.service';
import { TimeController } from './controllers/time/time.controller';
import { OrderAttendanceTimeService } from './services/time/order-attendance-time.service';

@Module({
  imports: [DataModule],
  controllers: [
    ReportsController,
    ProductSalesController,
    OrderReportsController,
    CancellationController,
    CoutesiesController,
    TimeController,
  ],
  providers: [
    ReportsService,
    ReportsIntegrations,
    PeriodIntegration,
    TipsService,
    DailyTipsReportsService,
    ProductSalesIntegrations,
    ProductSalesService,
    SalesService,
    EmployeeOrdersIntegrations,
    OrdersService,
    EmployeeOrdersService,
    CancelsIntegration,
    CancellationsService,
    OrderCancellationsService,
    ProductsCancellationService,
    SalesIntegration,
    ProductSalesService,
    CourtesiesIntegration,
    CoutesiesService,
    GetPeriodCourtesiesService,
    GetProductCourtesiesService,
    TimeIntegration,
    TimeService,
    OrderAttendanceTimeService,
  ],
})
export class ReportsModule {}

import { Module } from '@nestjs/common';
import { SalesController } from './controllers/sales/sales.controller';
import { SalesService } from './services/sales/sales.service';
import { CrudSalesService } from './services/sales/crud-sales.service';
import { DataModule } from 'src/app/data/data.module';
import { SalesIntegrations } from './integrations/sales-integrations';
import { OnsiteSalesIntegrations } from './integrations/onsite-sales-integrations';
import { EmployeeSalesService } from './services/employee-sales/employee-sales.service';

@Module({
  imports: [DataModule],
  controllers: [SalesController],
  providers: [
    SalesService,
    CrudSalesService,
    SalesIntegrations,
    OnsiteSalesIntegrations,
    EmployeeSalesService,
  ],
})
export class SalesModule {}

import { Module } from '@nestjs/common';
// import { BoundedManagementModule } from './tenant-management/bounded-management.module';
import { OperatingPeriodModule } from './temp/operating-period/operating-period.module';

@Module({
  imports: [/* BoundedManagementModule,*/ OperatingPeriodModule],
})
export class BoundedModule {}

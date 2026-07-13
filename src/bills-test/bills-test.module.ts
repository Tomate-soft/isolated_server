import { Module } from '@nestjs/common';
import { BillsTestController } from './bills-test.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Bills, BillSchema } from '@schema/sales/bills.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Bills.name, schema: BillSchema }])],
  controllers: [BillsTestController],
})
export class BillsTestModule {}

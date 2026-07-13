import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BillHistoryController } from './bill-history.controller';
import { BillHistoryService } from './bill-history.service';
import { Bills, BillSchema } from '@schema/sales/bills.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Bills.name, schema: BillSchema }], 'RS_HISTORICAL'),
    MongooseModule.forFeature([{ name: Bills.name, schema: BillSchema }]),
  ],
  controllers: [BillHistoryController],
  providers: [BillHistoryService],
})
export class BillHistoryModule {}

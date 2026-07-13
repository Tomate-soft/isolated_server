import { Module } from '@nestjs/common';
import { CounterController } from './counter.controller';
import { CounterService } from './counter.service';
import { MongooseModule } from '@nestjs/mongoose';
import { BillsCounter, BillsCounterSchema } from 'src/schemas/counters/billsCounter.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: BillsCounter.name, schema: BillsCounterSchema }])],
  controllers: [CounterController],
  providers: [CounterService],
})
export class CounterModule {}

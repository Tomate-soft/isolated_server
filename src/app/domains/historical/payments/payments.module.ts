import { Module } from '@nestjs/common';
import { CrudPaymentsService } from './services/payments/crudPayments.services';
import { PaymentsService } from './services/payments/payments.service';
import { WritePaymentsController } from './controllers/write/writePayments.controller';
import { ReadPaymentsController } from './controllers/read/readPayments.controller';
import { DataModule } from 'src/app/data/data.module';

@Module({
  imports: [DataModule],
  controllers: [ReadPaymentsController, WritePaymentsController],
  providers: [PaymentsService, CrudPaymentsService],
})
export class PaymentsModule {}

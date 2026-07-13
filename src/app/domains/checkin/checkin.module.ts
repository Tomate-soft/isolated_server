import { Module } from '@nestjs/common';
import { Integration } from './integration/integration';
import { CheckinController } from './controllers/checkin.controller';
import { CheckinService } from './services/checkin.service';
import { DataModule } from 'src/app/data/data.module';

@Module({
  imports: [DataModule],
  providers: [Integration, CheckinService],
  controllers: [CheckinController],
})
export class CheckinModule {}

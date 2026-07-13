import { Module } from '@nestjs/common';
import { BroadcastController } from './controllers/broadcast/broadcast.controller';
import { BroadcastService } from './services/broadcast/broadcast.service';
import { BroadcastGateway } from './broadcast.gateway';
import { Integration } from './integrations/integration';
import { WaitlistRegister } from './integrations/waitlist-register';
import { DataModule } from '../../data/data.module';

@Module({
  imports: [DataModule],
  controllers: [BroadcastController],
  providers: [BroadcastService, BroadcastGateway, Integration, WaitlistRegister],
})
export class BroadcastModule {}

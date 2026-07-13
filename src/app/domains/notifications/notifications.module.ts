import { Module } from '@nestjs/common';
import { TelegramNotifyService } from './services/telegram-notify.service';

@Module({
  providers: [TelegramNotifyService],
  exports: [TelegramNotifyService],
})
export class NotificationsModule {}

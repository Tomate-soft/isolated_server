import { Injectable } from '@nestjs/common';
import { TelegramNotifyService } from '../../notifications/services/telegram-notify.service';

@Injectable()
export class NotifyIntegrations {
  constructor(private readonly telegramService: TelegramNotifyService) {}

  sendTelegramMessage(message: string) {
    return this.telegramService.sendMessage(message);
  }
}

import { Injectable } from '@nestjs/common';
import { TelegramNotifyService } from './telegram-notify.service';

@Injectable()
export class NotificationsService {
  constructor(private readonly telegramService: TelegramNotifyService) {}

  telegramNotify(message: string) {
    return this.telegramService.sendMessage(message);
  }
}

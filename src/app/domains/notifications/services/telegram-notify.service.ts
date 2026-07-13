import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { notificationsConfig } from 'src/app/config/notifications';
import axios from 'axios';

@Injectable()
export class TelegramNotifyService {
  private readonly TELEGRAM_URL = notificationsConfig.telegram.token;
  private readonly CHAT_ID = notificationsConfig.telegram.chat_id;

  async sendMessage(message: string) {
    try {
      const response = await axios.post(this.TELEGRAM_URL, {
        chat_id: this.CHAT_ID,
        text: message,
      });
      return response.data;
    } catch (error) {
      throw new InternalServerErrorException(`Error enviando mensaje a Telegram: ${error}`);
    }
  }
}

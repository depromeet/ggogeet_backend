import axios from 'axios';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TelegramMonitoringService {
  private readonly chatId: string;
  private readonly botToken: string;

  constructor() {
    this.chatId = process.env.TELEGRAM_CHAT_ID;
    this.botToken = process.env.TELEGRAM_BOT_TOKEN;
  }

  public sendAlert(message: string) {
    const config = {
      method: 'get',
      url: `https://api.telegram.org/bot${this.botToken}/sendMessage?chat_id=${this.chatId}&text=${message}`,
      headers: {},
    };

    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
      })
      .catch(function (error) {
        console.log(error);
      });
  }
}

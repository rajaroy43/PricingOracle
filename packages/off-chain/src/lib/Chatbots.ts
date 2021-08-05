import { Telegram } from "telegraf";

class TelegramBot {
  groupId: number;
  telegram: any;
  prefix: string;
  constructor(token: string, groupId: number, prefix: string) {
    if (!token || !groupId) {
      throw new Error("Both token and groupId are required");
    }
    this.groupId = groupId;
    this.telegram = new Telegram(token);
    this.prefix = prefix || "";
  }

  async sendMessage(msg: string) {
    try {
      if (this.prefix) {
        msg = `[${this.prefix}] ${msg}`;
      }
      await this.telegram.sendMessage(this.groupId, msg);
    } catch (err) {
      console.error(err);
    }
  }
}
export default TelegramBot;

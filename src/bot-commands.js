import axios from 'axios';
import { Telegraf } from 'telegraf';

export default function initBot() {
  const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

  bot.start((ctx) => ctx.reply('Hello!'));

  bot.help((ctx) => ctx.reply('Work in progress!'));

  bot.command('secret', (ctx) => ctx.replyWithMarkdownV2('||Аня и Лера красотки||'));

  bot.on('text', (ctx) => ctx.reply(ctx.message.text));

  bot.on('document', async (ctx) => {
    const { file_id, file_name } = ctx.message.document;

    if (!file_name.endsWith('.json')) return ctx.reply('Only .json files are supported!');

    const { file_path } = await ctx.telegram.getFile(file_id);

    const link = `https://api.telegram.org/file/bot${process.env.TELEGRAM_BOT_TOKEN}/${file_path}`;

    try {
      const { data } = await axios.get(link);
      return ctx.reply(JSON.stringify(data[0].ticket.document.receipt.items));
    } catch (err) {
      console.log(`Error!\n${err}`);
      return ctx.reply(err);
    }
  });

  return bot;
}

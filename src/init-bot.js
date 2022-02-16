import axios from 'axios';
import { Telegraf, session, Markup } from 'telegraf';
import stage from './scenes.js';

export default function initBot() {
  const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

  bot.use(session());
  bot.use(stage.middleware());

  bot.start((ctx) => ctx.reply('Hello!', Markup.removeKeyboard()));
  bot.help((ctx) => ctx.reply('Work in progress!'));

  bot.command('secret', (ctx) => ctx.replyWithMarkdownV2('||Аня и Лера красотки||'));

  bot.on('text', (ctx) => ctx.reply(ctx.message.text));
  bot.on('document', async (ctx) => {
    const { file_id, file_name } = ctx.message.document;

    if (!file_name.endsWith('.json')) return ctx.reply('Only .json files are supported!');

    const { file_path } = await ctx.telegram.getFile(file_id);
    const link = `https://api.telegram.org/file/bot${process.env.TELEGRAM_BOT_TOKEN}/${file_path}`;
    const { data } = await axios.get(link);
    const { items } = data[0].ticket.document.receipt;

    if (!items) return ctx.reply('Invalid .json!');

    ctx.session.items = items;
    ctx.session.names = [];

    return ctx.scene.enter('addScene');
  });

  return bot;
}

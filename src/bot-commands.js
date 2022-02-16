import axios from 'axios';
import {
  Telegraf, session, Scenes, Markup,
} from 'telegraf';

const getNamesKeyboard = (ctx) => {
  if ((ctx.session.names.length ?? 0) !== 0) {
    return Markup.inlineKeyboard([
      [Markup.button.callback('Add', 'add'), Markup.button.callback('Remove', 'remove')],
      [Markup.button.callback('Next', 'next')],
    ]);
  }
  return Markup.inlineKeyboard([
    [Markup.button.callback('Add', 'add')],
  ]);
};

const getRemovalKeyboard = (ctx) => {
  const buttons = ctx.session.names.map((name) => [Markup.button.text(name)]);
  return Markup.keyboard([
    ...buttons,
    [Markup.button.text('❌ Cancel')],
  ]).oneTime();
};

const formatNames = (names) => {
  if ((names.length ?? 0) === 0) return 'Buyers list empty!';
  return `*Buyers:*\n${names.join('\n')}`;
};

const addScene = new Scenes.BaseScene('addScene');
addScene.enter((ctx) => ctx.reply('Enter name:'));
addScene.on('text', (ctx) => {
  ctx.session.names.push(ctx.message.text);
  return ctx.scene.enter('nameScene');
});

const removeScene = new Scenes.BaseScene('removeScene');
removeScene.enter((ctx) => ctx.reply('Select a name to remove', getRemovalKeyboard(ctx)));
removeScene.hears('Cancel', (ctx) => ctx.scene.enter('nameScene'));
removeScene.on('text', (ctx) => {
  ctx.session.names = ctx.session.names.filter((name) => name !== ctx.message.text);
  return ctx.reply('Complete!', Markup.removeKeyboard()).then(() => ctx.scene.enter('nameScene'));
});

const itemsScene = new Scenes.BaseScene('itemsScene');

const namesScene = new Scenes.BaseScene('nameScene');
namesScene.enter((ctx) => ctx.replyWithMarkdownV2(
  formatNames(ctx.session.names),
  getNamesKeyboard(ctx),
));
namesScene.on('text', (ctx) => ctx.reply('Send /quit to leave the scene'));
namesScene.action('add', (ctx) => {
  ctx.answerCbQuery();
  return ctx.scene.enter('addScene');
});
namesScene.action('remove', (ctx) => {
  ctx.answerCbQuery();
  return ctx.scene.enter('removeScene');
});
namesScene.action('next', (ctx) => {
  ctx.answerCbQuery();
  return ctx.scene.enter('');
});

const stage = new Scenes.Stage([namesScene, addScene, removeScene, itemsScene]);
stage.command('quit', (ctx) => ctx.scene.leave());

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
    ctx.session.items = items;
    ctx.session.names = [];
    return ctx.scene.enter('addScene');
  });

  return bot;
}

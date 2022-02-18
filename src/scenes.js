import { Scenes, Markup } from 'telegraf';
import {
  getNamesKeyboard, getRemovalKeyboard, getQuestionKeyboard, getSelectKeyboard,
} from './keyboards.js';

function formatNames(names) {
  if (!names?.length) return '_Buyers list empty_';
  return `*Buyers:*\n${names.join('\n')}`;
}

const addScene = new Scenes.BaseScene('addScene');
addScene.enter((ctx) => ctx.reply('Enter name:'));
addScene.on('text', (ctx) => {
  ctx.session.names.push(ctx.message.text);
  return ctx.scene.enter('nameScene');
});

const removeScene = new Scenes.BaseScene('removeScene');
removeScene.enter((ctx) => ctx.reply('Select a name to remove', getRemovalKeyboard(ctx.session.names)));
removeScene.hears('Cancel', (ctx) => ctx.scene.enter('nameScene'));
removeScene.on('text', async (ctx) => {
  ctx.session.names = ctx.session.names.filter((name) => name !== ctx.message.text);
  await ctx.reply('Complete!', Markup.removeKeyboard());
  return ctx.scene.enter('nameScene');
});

const namesScene = new Scenes.BaseScene('nameScene');
namesScene.enter((ctx) => ctx.replyWithMarkdownV2(
  formatNames(ctx.session.names),
  getNamesKeyboard(ctx.session.names),
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
  return ctx.scene.enter('itemsScene');
});

const itemsScene = new Scenes.BaseScene('itemsScene');
itemsScene.enter((ctx) => ctx.scene.enter('questionScene'));

const questionScene = new Scenes.BaseScene('questionScene');
questionScene.enter((ctx) => ctx.reply('One more question?', getQuestionKeyboard()));
questionScene.action('yes', async (ctx) => {
  ctx.answerCbQuery();
  await ctx.editMessageReplyMarkup(null);
  return ctx.scene.enter('questionScene');
});
questionScene.action('no', async (ctx) => {
  ctx.answerCbQuery();
  await ctx.editMessageReplyMarkup(null);
  await ctx.reply('Alright then!');
  return ctx.scene.leave();
});

const counterScene = new Scenes.BaseScene('counterScene');
counterScene.enter((ctx) => {
  ctx.session.counter = 0;
  return ctx.reply('press the button to increment the counter', Markup.inlineKeyboard([[Markup.button.callback('button', 'button')]]));
});
counterScene.action('button', (ctx) => {
  ctx.answerCbQuery();
  ctx.session.counter += 1;
  return ctx.editMessageReplyMarkup({ inline_keyboard: [[{ text: `${ctx.session.counter}`, callback_data: 'button' }]] });
});

const selectScene = new Scenes.BaseScene('selectScene');
selectScene.enter((ctx) => {
  const names = ['alice', 'bob', 'charlie'];
  ctx.scene.state.options = names.reduce((acc, name) => { acc[name] = false; return acc; }, {});
  return ctx.reply('Click to select/remove selection', getSelectKeyboard(ctx.scene.state.options));
});
selectScene.action(/.+/, (ctx) => {
  ctx.answerCbQuery();
  const choice = ctx.callbackQuery.data;
  ctx.scene.state.options[choice] = !ctx.scene.state.options[choice];
  return ctx.editMessageReplyMarkup(
    getSelectKeyboard(ctx.scene.state.options).reply_markup,
  );
});

const stage = new Scenes.Stage([
  namesScene,
  addScene,
  removeScene,
  itemsScene,
  questionScene,
  counterScene,
  selectScene,
]);
stage.command('quit', (ctx) => ctx.scene.leave());

export default stage;

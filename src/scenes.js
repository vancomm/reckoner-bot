import { Scenes, Markup } from 'telegraf';
import { getNamesKeyboard, getRemovalKeyboard } from './keyboards.js';

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
itemsScene.enter((ctx) => ctx.reply('Work in progress! Use /quit to go back to main menu.'));
itemsScene.on('text', (ctx) => ctx.reply('Work in progress! Use /quit to go back to main menu.'));

const stage = new Scenes.Stage([namesScene, addScene, removeScene, itemsScene]);
stage.command('quit', (ctx) => ctx.scene.leave());

export default stage;

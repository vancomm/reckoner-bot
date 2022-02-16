import { Scenes, Markup } from 'telegraf';
import { getNamesKeyboard, getRemovalKeyboard } from './keyboards.js';

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

export default stage;
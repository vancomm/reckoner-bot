const { Telegraf } = require("telegraf");

const initBotCommands = (bot) => {
  bot.start((ctx) => ctx.reply('Hello!'));

  // bot.help((ctx) => ctx.reply('Work in progress!'));
};

module.exports = {
  initBotCommands,
};

const { Telegraf } = require("telegraf");

const initBotCommands = (bot) => {
  bot.start((ctx) => {
    return ctx.reply("Hello!")
  });

  bot.help((ctx) => {
    return ctx.reply('Work in progress!')
  });

  bot.on("text", (ctx) => {
    return ctx.reply(ctx.message.text);
  })
};

module.exports = {
  initBotCommands,
};

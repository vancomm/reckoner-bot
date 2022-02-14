const { Telegraf } = require("telegraf");
const axios = require('axios');

const initBotCommands = (bot) => {
  bot.start((ctx) => {
    return ctx.reply("Hello!")
  });
  
  bot.help((ctx) => {
    return ctx.reply('Work in progress!')
  });
  
  bot.command("secret", (ctx) => {
    return ctx.replyWithMarkdownV2('||Аня и Лера красотки||');
  });
  
  bot.on("text", (ctx) => {
    return ctx.reply(ctx.message.text);
  });

  bot.on("document", async (ctx) => {
    const { file_id, file_name } = ctx.message.document;

    if (!file_name.endsWith('.json')) return ctx.reply('Only .json files are supported!');

    const { file_path } = await ctx.telegram.getFile(file_id);

    const link = `https://api.telegram.org/file/bot${process.env.TELEGRAM_BOT_TOKEN}/${file_path}`;  

    try {
      const { data } = await axios.get(link);
      return ctx.reply(data);
    } catch (err) {
      console.log('Error!\n' + err);
      return ctx.reply(err);
    }

  });
};

module.exports = {
  initBotCommands,
};

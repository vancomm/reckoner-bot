'use strict';

require("dotenv").config();
const { Telegraf } = require("telegraf");
const { initBotCommands } = require("./bot-commands.js");

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

initBotCommands(bot);

module.exports.hello = async (event) => {
  const response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    body: '',
  };

  if (!event.body) {
    response.statusCode = 404;
    response.body = 'Not Found';
    return response;
  }

  try {
    const update = JSON.parse(event.body);
    await bot.handleUpdate(update);
  } catch (err) {
    console.log(err);
    response.statusCode = 404;
    response.body = 'Not Found';
  }

  return response;
};

module.exports.setWebhook = async (event) => {
  const response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    body: '',
  };
  const url = `https://${event.headers.Host}/${event.requestContext.stage}/webhook`;
  try {
    await bot.telegram.setWebhook(url);
  } catch (err) {
    console.log(err);
    response.statusCode = 404;
    response.body = 'Not Found';
  }
  return response;
};

module.exports.deleteWebhook = async (event) => {
  const response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    body: '',
  };
  try {
    await bot.telegram.deleteWebhook({drop_pending_updates: true});
  } catch (err) {
    console.log(err);
    response.statusCode = 404;
    response.body = 'Not Found';
  }
  return response;
};

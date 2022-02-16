/* eslint-disable no-unused-vars */
import 'dotenv/config';
import initBot from './init-bot.js';

const bot = initBot();

export async function hello(event) {
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
}

export async function setWebhook(event) {
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
}

export async function deleteWebhook(event) {
  const response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    body: '',
  };

  try {
    await bot.telegram.deleteWebhook({ drop_pending_updates: true });
  } catch (err) {
    console.log(err);
    response.statusCode = 404;
    response.body = 'Not Found';
  }

  return response;
}

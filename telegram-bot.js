const http = require('http');
const TelegramBot = require('node-telegram-bot-api');

const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, {polling: true});

let status;
let chatID;
let timeout;

bot.on('message', (msg) => {

  chatID = chatID || msg.chat.id;

  if(msg.text.length === 6 && Number.isInteger(+msg.text)){

    checkStatus(msg.text, true);

  } else if (msg.text.toLowerCase() === 'stop') {

    if(timeout){ clearTimeout(timeout); }

    bot.sendMessage(chatID, 'Бот остановлен');

  }else {

    bot.sendMessage(chatID, 'Введи номер заказа паспорта (6 цифр)');

  }

});

function checkStatus(passID, showResult){

  http.request({
    host: 'passport.mfa.gov.ua',
    path: `/Home/CurrentSessionStatus?sessionId=${passID}`
  }, (response) => {

    let str = '';

    response.on('data', (chunk) => {str += chunk;});

    response.on('end', () => {

      if(!str){
        bot.sendMessage(chatID, `Нет данных о заказе #${passID}`);
        return;
      }

      if(showResult || (status && status !== str)){

        bot.sendMessage(chatID, parseResponse(str));

        bot.sendMessage(chatID, `Когда статус заказа #${passID} изменится - бот сообщит об этом \nВведи STOP чтобы не получать обновления`);

      } else {

        console.log(`${parseDate(new Date)} (${passID}) - status unchanged`);

      }

      timeout = setTimeout(() => { checkStatus(passID); }, process.env.UPDATE_FREQUENCY * 60 * 1000);

      status = str;

    });

  }).end();

}

function parseResponse(resp){

  resp = JSON.parse(resp);

  let parsed = `Статус заказа #${resp.UserSessionId}:`;

  resp.StatusInfo.forEach((step) => {

    parsed += `\n ${parseDate(new Date(step.StatusDateUF))} - ${step.StatusName}`;

  });

  return parsed;

}

function parseDate(date){

  let minutes = date.getMinutes();

  minutes = (minutes < 10 ? '0' : '') + minutes;

  return `${date.getHours()}:${minutes} ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

}

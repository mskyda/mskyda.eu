'use strict';
require('dotenv').config();
const express = require('express');
const vhost = require('vhost');
const http = require('http');
const https = require('https');
const TelegramBot = require('node-telegram-bot-api');

const app = express();
const mischa = express();
const ira = express();
const finik = express();

app.use(vhost('mischa.skyda.eu', mischa));
app.use(vhost('ira.skyda.eu', ira));
app.use(vhost('finik.skyda.eu', finik));

app.use(express.static(__dirname + '/public/root/'));
mischa.use(express.static(__dirname + '/public/mischa/'));
ira.use(express.static(__dirname + '/public/ira/'));
finik.use(express.static(__dirname + '/public/finik/'));

app.listen(process.env.PORT || 8080);

const pingURL = 'https://hc-ping.com/bbe983a2-ecb2-4113-a662-db781a84612e'; // todo: move to env vars

setInterval(() => { https.get(pingURL); }, 5 * 60000);

module.exports = app;

const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, {polling: true});

let status;
let chatID;

bot.on('message', (msg) => {

  chatID = chatID || msg.chat.id;

  if(msg.text.length === 6 && Number.isInteger(+msg.text)){

    checkStatus(msg.text, true);

    setTimeout(() => { checkStatus(msg.text); }, 10000);

  } else {

    bot.sendMessage(chatID, 'Enter Pass ID - must be 6 digits')

  }

});

function checkStatus(passID, toShowResult){

  http.request({
    host: 'passport.mfa.gov.ua',
    path: `/Home/CurrentSessionStatus?sessionId=${passID}`
  }, (response) => {

    let str = '';

    response.on('data', (chunk) => {str += chunk;});

    response.on('end', () => {

      if(!str){
        bot.sendMessage(chatID, 'Wrong ID');
        return;
      }

      if(status && status !== str){

        bot.sendMessage(chatID, 'STATUS CHANGED');

      }

      status = str;

      if(toShowResult){ bot.sendMessage(chatID, status); }

    });

  }).end();

}

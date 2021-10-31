'use strict';
require('dotenv').config();
const express = require('express');
const vhost = require('vhost');
const https = require('https');

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

setInterval(() => { https.get(process.env.PING_URL); }, 5 * 60000);

module.exports = app;

require('./telegram-bot');
require('./resolve-dns');
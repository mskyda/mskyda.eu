'use strict';

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

const pingURL = 'https://hc-ping.com/bbe983a2-ecb2-4113-a662-db781a84612e'; // todo: move to env vars

setInterval(() => { https.get(pingURL); }, 5 * 60000);

module.exports = app;

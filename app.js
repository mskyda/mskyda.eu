'use strict';

const express = require('express');
const vhost = require('vhost');
const path = require('path');

const app = express();
const mischa = express();
const ira = express();

app.use(vhost('mischa.skyda.eu', mischa));
app.use(vhost('ira.skyda.eu', ira));

app.use(express.static(__dirname + '/public/root/'));
mischa.use(express.static(__dirname + '/public/mischa/'));
ira.use(express.static(__dirname + '/public/ira/'));


app.listen(process.env.PORT || 8080);

module.exports = app;

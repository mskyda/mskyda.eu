'use strict';

// [START gae_node_request_example]
const express = require('express');
const vhost = require('vhost');
const path = require('path');

const app = express();
const mischa = express();
const ira = express();

app.use(vhost('mischa.skyda.eu', mischa));
app.use(vhost('ira.skyda.eu', ira));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/public/index.html'));
});

mischa.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/public/mischa.html'));
});

ira.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/public/ira.html'));
});

app.listen(process.env.PORT || 8080);

module.exports = app;

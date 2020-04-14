require('module-alias/register');

const express = require('express');
const socket = require('socket.io');
const http = require('http');

const homeRoute = require('@routes/home');

const { DEFAULT_PORT } = require('@lib/constants');

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || DEFAULT_PORT;

app.use(express.static('client/static'));

app.get('/', homeRoute);

server.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`)
});

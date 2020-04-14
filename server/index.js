require('dotenv-safe').config();
require('module-alias/register');

const express = require('express');
const socket = require('socket.io');
const http = require('http');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const homeRoute = require('@routes/home');
const spotifyLogin = require('@routes/auth/login');
const spotifyCallback = require('@routes/auth/callback');

const { ports } = require('@lib/constants');

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || ports.DEFAULT;

app.use(express.static('client/static'));
app.use(cookieParser());
app.use(cors());

app.get('/', homeRoute);
app.get('/auth/login', spotifyLogin);
app.get('/auth/callback', spotifyCallback);

server.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`)
});

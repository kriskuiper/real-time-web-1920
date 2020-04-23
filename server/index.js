require('dotenv-safe').config();
require('module-alias/register');

const express = require('express');
const http = require('http');
const socket = require('socket.io');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const database = require('@database');
const homeRoute = require('@routes/home');
const partyRoute = require('@routes/party');
const joinRoute = require('@routes/join');

// Spotify authentication routes
const spotifyLogin = require('@routes/auth/login');
const spotifyCallback = require('@routes/auth/callback');

const { ports } = require('@lib/constants');

const app = express();
const server = http.createServer(app);
const io = socket(server);
const PORT = process.env.PORT || ports.DEFAULT;

database.connect().catch(console.error);

app.use(express.static('client/static'));
app.use(cookieParser());
app.use(cors());

app.get('/', homeRoute);
app.get('/party-:id', partyRoute);
app.get('/join', joinRoute);

app.get('/auth/login', spotifyLogin);
app.get('/auth/callback', spotifyCallback);

server.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`)
});

module.exports = { io };

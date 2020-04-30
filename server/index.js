require('dotenv-safe').config();
require('module-alias/register');

const express = require('express');
const session = require('express-session');
const http = require('http');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const database = require('@database');
const homeRoute = require('@routes/home');
const partyRoute = require('@routes/party');
const joinRoute = require('@routes/join');

// Spotify authentication routes
const spotifyLogin = require('@routes/auth/login');
const spotifyCallback = require('@routes/auth/callback');

const searchRoute = require('@routes/search');

const { ports } = require('@lib/constants');
const ioInstance = require('@lib/io-instance');

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || ports.DEFAULT;

ioInstance.create(server);

database.connect().catch(console.error);

app.use(express.static('client/static'));
app.use(cookieParser());
app.use(cors());
app.use(session({
	saveUninitialized: false,
	resave: false,
	secret: process.env.SESSION_SECRET
}))

app.get('/', homeRoute);
app.get('/party-:id', partyRoute);
app.get('/join', joinRoute);

app.get('/auth/login', spotifyLogin);
app.get('/auth/callback', spotifyCallback);

app.get('/api/search', searchRoute);

server.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`)
});

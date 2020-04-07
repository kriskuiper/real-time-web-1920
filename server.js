const express = require('express');
const socket = require('socket.io');
const http = require('http');
const path = require('path');

const getStartIndex = require('./lib/get-start-index');
const {
	DEFAULT_PORT,
	DEFAULT_USERNAME
} = require('./lib/constants');

const app = express();
const server = http.createServer(app);
const io = socket(server);
const PORT = process.env.PORT || DEFAULT_PORT;
const messages = [];

app.use(express.static('static'));
app.get('/', (request, response) => {
  response.sendFile(path.join(__dirname, 'static/index.html'));
});

io.on('connection', (socket) => {
	socket.on('show messages', () => {
		const userMessage = (message) => message.includes(socket.username);
		let userMessageIndex = messages.findIndex(userMessage);

		if (userMessageIndex === -1) {
			userMessageIndex = messages.length;
		}

		const messagesToShow = messages.slice(
			getStartIndex(userMessageIndex),
			userMessageIndex
		);

		socket.emit('show messages', messagesToShow);
	});

	socket.on('set username', (username) => {
		socket.username = username || DEFAULT_USERNAME;

		socket.emit('server message', `SERVER: Welcome to the chat ${socket.username}.`);
		socket.broadcast.emit('server message', `SERVER: ${socket.username} has joined the chat.`);
	});

	socket.on('chat message', (message) => {
		messages.push(`${socket.username}: ${message}`);

		socket.emit('chat message', `You: ${message}`);
		socket.broadcast.emit('chat message', `${socket.username}: ${message}`);
	});

	socket.on('typing', () => {
		socket.broadcast.emit('typing', `${socket.username} is typing`);
	});

	socket.on('not typing', () => {
		socket.broadcast.emit('not typing');
	});

	socket.on('disconnect', () => {
		socket.broadcast.emit('server message', `SERVER: ${socket.username} disconnected`)
	});
});

server.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`)
});

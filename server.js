const express = require('express');
const socket = require('socket.io');
const http = require('http');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socket(server);
const PORT = process.env.PORT || 4000;

app.use(express.static('static'));
app.get('/', (request, response) => {
  response.sendFile(path.join(__dirname, 'static/index.html'));
});

io.on('connection', (socket) => {
	console.log('A user connected');

	socket.on('chat message', (userConfig) => {
		io.emit('chat message', userConfig);
	});

	socket.on('typing', (name) => {
		socket.broadcast.emit('typing', name);
	});

	socket.on('not typing', () => {
		socket.broadcast.emit('not typing');
	});

	socket.on('disconnect', () => {
		console.log('A user disconnected')
	});
});

server.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`)
});

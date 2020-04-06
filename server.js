const express = require('express');
const socket = require('socket.io');
const http = require('http');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socket(server);

app.use(express.static('static'));
app.get('/', (request, response) => {
  response.sendFile(path.join(__dirname, 'static/index.html'));
});

io.on('connection', (socket) => {
	console.log('A user connected');

	socket.on('chat message', (message) => {
		io.emit('chat message', message);
	});

	socket.on('disconnect', () => {
		console.log('A user disconnected')
	});
});

server.listen(3000, () => {
  console.log(`Listening on http://localhost:3000`)
});

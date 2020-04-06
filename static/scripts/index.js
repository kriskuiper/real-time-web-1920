const socket = io();

const list = document.getElementById('messageList');
const form = document.getElementById('messageForm');
const input = document.getElementById('messageInput');

form.addEventListener('submit', onFormSubmit);

socket.on('chat message', appendMessage)

function onFormSubmit(event) {
	event.preventDefault();

	socket.emit('chat message', input.value);
}

function appendMessage(message) {
	const li = document.createElement('li');
	li.textContent = message;

	list.appendChild(li);

	input.value = ''
}

const socket = io();

const $userNameForm = document.getElementById('userNameForm');
const $userNameInput = document.getElementById('userNameInput');
const $userNameOverlay = document.getElementById('userNameOverlay');
const $lastMessageButton = document.getElementById('lastMessagesButton');
const $lastMessageList = document.getElementById('lastMessages');
const $messageList = document.getElementById('messageList');
const $messageForm = document.getElementById('messageForm');
const $messageInput = document.getElementById('messageInput');
const $typingFeedback = document.getElementById('typingFeedback');

$userNameForm.addEventListener('submit', onUserNameFormSubmit);
$userNameOverlay.addEventListener('transitionend', onOverlayTransitionEnd);
$messageForm.addEventListener('submit', onMessageFormSubmit);
$messageInput.addEventListener('input', onMessageFormInput);
$lastMessageButton.addEventListener('click', showLastMessages);

socket.on('show messages', showMessages);
socket.on('chat message', (message) => appendMessage(message, $messageList));
socket.on('server message', appendServerMessage);
socket.on('typing', showTyping);
socket.on('not typing', hideTyping);

function onUserNameFormSubmit(event) {
	event.preventDefault();

	const { value } = $userNameInput;

	if (!value) {
		return
	}

	socket.emit('set username', value);

	$userNameOverlay.classList.remove('is-shown');
	$messageInput.focus();
}

function onOverlayTransitionEnd(event) {
	document.body.removeChild(event.target);
}

function onMessageFormInput(event) {
	const { value } = event.target

	if (value) {
		socket.emit('typing');
	} else {
		socket.emit('not typing');
	}
}

function onMessageFormSubmit(event) {
	event.preventDefault();

	socket.emit('chat message', $messageInput.value);
	socket.emit('not typing');

	$messageInput.value = '';
}


function showTyping(message) {
	$typingFeedback.textContent = message;
	$typingFeedback.classList.add('is-shown');
}

function hideTyping() {
	$typingFeedback.textContent = '...';
	$typingFeedback.classList.remove('is-shown');
}

function appendServerMessage(message) {
	if (!message) {
		return
	}

	const li = createMessageElement(message);
	li.classList.add('server-message');

	$messageList.appendChild(li);
}

function appendMessage(message, list) {
	if (!message) {
		return
	}

	const li = createMessageElement(message);

	list.appendChild(li);
}

function createMessageElement(message) {
	const li = document.createElement('li');
	li.textContent = message;

	return li;
}

function showLastMessages() {
	socket.emit('show messages');
}

function showMessages(messages) {
	for (message of messages) {
		appendMessage(message, $lastMessageList);
	}

	document.body.removeChild($lastMessageButton);
}

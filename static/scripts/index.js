const socket = io();
let userName = '';

const $userNameForm = document.getElementById('userNameForm');
const $userNameInput = document.getElementById('userNameInput');
const $userNameOverlay = document.getElementById('userNameOverlay');
const $messageList = document.getElementById('messageList');
const $messageForm = document.getElementById('messageForm');
const $messageInput = document.getElementById('messageInput');
const $typingFeedback = document.getElementById('typingFeedback');

$messageForm.addEventListener('submit', onMessageFormSubmit);
$messageInput.addEventListener('input', onMessageFormInput);
$userNameForm.addEventListener('submit', onUserNameFormSubmit);
$userNameOverlay.addEventListener('transitionend', onOverlayTransitionEnd);

socket.on('chat message', appendMessage);
socket.on('typing', showTyping);
socket.on('not typing', hideTyping);

function onUserNameFormSubmit(event) {
	event.preventDefault();

	const { value } = $userNameInput;

	if (!value) {
		return
	}

	userName = value;

	$userNameOverlay.classList.remove('is-shown');
}

function onOverlayTransitionEnd(event) {
	document.body.removeChild(event.target);
}

function onMessageFormInput(event) {
	const { value } = event.target

	if (value) {
		socket.emit('typing', userName);
	} else {
		socket.emit('not typing');
	}
}

function onMessageFormSubmit(event) {
	event.preventDefault();

	const userConfig = {
		name: userName,
		message: $messageInput.value
	}

	socket.emit('chat message', userConfig);
}


function showTyping(name) {
	if (name === userName) {
		return
	}

	$typingFeedback.textContent = `${name} is typing`;
	$typingFeedback.classList.add('is-shown');
}

function hideTyping() {
	$typingFeedback.textContent = '...';
	$typingFeedback.classList.remove('is-shown');
}

function appendMessage(userConfig) {
	if (!userConfig.message) {
		return
	}

	const li = document.createElement('li');

	console.log(userConfig);

	const userNameToShow = userConfig.name === userName
		? 'You'
		: userConfig.name


	li.textContent = `${userNameToShow}: ${userConfig.message}`;

	$messageList.appendChild(li);
	$messageInput.value = '';
	$typingFeedback.classList.remove('is-shown');
}

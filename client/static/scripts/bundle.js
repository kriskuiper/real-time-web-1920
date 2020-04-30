const namespace = window.location.pathname;
const socket = io(namespace);

const elements = {
	SEARCH_RESULTS: document.getElementById('spotify-search-results'),
	SEARCH_FORM: document.getElementById('spotify-search'),
	SEARCH_INPUT: document.getElementById('spotify-search-input'),
	SERVER_MESSAGES: document.getElementById('server-messages'),
	PARTY_VIEW: document.getElementById('party-view'),
	ACCESS_POPUP: document.getElementById('access-popup'),
	ACCESS_POPUP_TEXT: document.querySelector('#access-popup p'),
	ACCESS_BTN_ALLOW: document.getElementById('allow-button'),
	ACCESS_BTN_DISALLOW: document.getElementById('disallow-button'),
};

// DOM event listeners
if (elements.SEARCH_FORM) {
	elements.SEARCH_FORM.addEventListener('submit', showSearchResults);
}

if (elements.PARTY_VIEW) {
	elements.PARTY_VIEW.addEventListener('change', changeView);
}

if (elements.ACCESS_BTN_ALLOW) {
	elements.ACCESS_BTN_ALLOW.addEventListener('click', (event) => {
		const { socketId } = event.target.dataset;

		socket.emit('allowed', { socketId });

		elements.ACCESS_POPUP.classList.toggle('is-invisible');
	});
}

if (elements.ACCESS_BTN_DISALLOW) {
	elements.ACCESS_BTN_DISALLOW.addEventListener('click', (event) => {
		const { socketId } = event.target.dataset;

		socket.emit('disallowed', { socketId });

		elements.ACCESS_POPUP.classList.toggle('is-invisible');
	});
}

// Socket event listeners
socket.on('added to queue', showSongAdded);
socket.on('server message', showServerMessage);
socket.on('join', showAccessPopup);
socket.on('allowed', () => {
	console.log('You may join');
});
socket.on('disallowed', () => {
	console.log('You may not join');
});

function showAccessPopup({ username, socketId }) {
	const text = `${username} wants to join le party`;
	elements.ACCESS_POPUP.classList.toggle('is-invisible');
	elements.ACCESS_POPUP_TEXT.textContent = text;
	elements.ACCESS_BTN_ALLOW.setAttribute('data-socket-id', socketId);
	elements.ACCESS_BTN_DISALLOW.setAttribute('data-socket-id', socketId);
}

// Event handlers
function showServerMessage({ message }) {
	const $serverMessage = document.createElement('p');
	$serverMessage.textContent = message;
	$serverMessage.classList.add('server-message');

	elements.SERVER_MESSAGES.appendChild($serverMessage);
}

function showSongAdded({ uri }) {
	// So very imperformant but document.querySelector(`[data-uri="${uri}"]`)
	// doesn't work for some reason... :(
	const $buttons = document.querySelectorAll('button');
	const $songButton = Array.from($buttons).find($button => {
		return $button.dataset.uri === uri;
	});

	$songButton.setAttribute('disabled', true);
	$songButton.textContent = 'Added!';
	$songButton.parentElement.classList.add('is-added');
}

function changeView() {
	elements.SEARCH_FORM.classList.toggle('is-invisible');
	elements.SERVER_MESSAGES.classList.toggle('is-invisible');
}

async function showSearchResults(event) {
	event.preventDefault();

	const { value } = elements.SEARCH_INPUT;
	const response = await fetch(`/api/search?q=${value}`);
	const tracks = await response.json();

	removeChildElements(elements.SEARCH_RESULTS);

	for (track of tracks) {
		const $element = createSongElement(track);

		elements.SEARCH_RESULTS.appendChild($element);
	}

	setTimeout(() => {
		const buttons = document.querySelectorAll('.search-result button');

		addEventListeners(buttons);
	}, 0);
}

function createSongElement(songData) {
	const $div = document.createElement('div');
	const	$title = document.createElement('h3');
	const $artist = document.createElement('p');
	const $button = document.createElement('button');

	$div.classList.add('search-result');
	$title.textContent = songData.name;
	$artist.textContent = songData.artists[0].name;

	$button.textContent = 'Add to queue';
	$button.setAttribute('data-uri', songData.uri);
	$button.setAttribute('type', 'button');
	$button.classList.add('btn');
	$button.classList.add('btn-secondary');

	$div.appendChild($title);
	$div.appendChild($artist);
	$div.appendChild($button);

	return $div;
}

function addEventListeners(buttons) {
	for (button of buttons) {
		button.addEventListener('click', addToQueue);
	}
}

async function addToQueue(event) {
	const { uri } = event.target.dataset;

	socket.emit('add to queue', { uri });
}

function removeChildElements(parent) {
	while (parent.firstChild) {
		parent.removeChild(parent.firstChild);
	}
}

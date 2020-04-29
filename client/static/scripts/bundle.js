const socket = io();

const elements = {
	SEARCH_RESULTS: document.getElementById('spotify-search-results'),
	SEARCH_FORM: document.getElementById('spotify-search'),
	SEARCH_INPUT: document.getElementById('spotify-search-input'),
	SERVER_MESSAGES: document.getElementById('server-messages'),
	PARTY_VIEW: document.getElementById('party-view')
};

// DOM event listeners
if (elements.SEARCH_FORM) {
	elements.SEARCH_FORM.addEventListener('submit', showSearchResults);
}

if (elements.PARTY_VIEW) {
	elements.PARTY_VIEW.addEventListener('change', changeView);
}

// Socket event listeners
socket.on('added to queue', showSongAdded);
socket.on('server message', showServerMessage);

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

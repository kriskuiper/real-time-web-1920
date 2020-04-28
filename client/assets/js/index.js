const elements = {
	SEARCH_RESULTS: document.getElementById('spotify-search-results'),
	SEARCH_FORM: document.getElementById('spotify-search'),
	SEARCH_INPUT: document.getElementById('spotify-search-input')
}

elements.SEARCH_FORM.addEventListener('submit', async (event) => {
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
	}, 0)
})

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

	$div.appendChild($title);
	$div.appendChild($artist);
	$div.appendChild($button);

	return $div;
}

function addEventListeners(buttons) {
	for (button of buttons) {
		button.addEventListener('click', addToQueue)
	}
}

async function addToQueue(event) {
	const { uri } = event.target.dataset;

	const response = await fetch(`/api/add-to-queue?uri=${uri}`);
	const json = await response.json();

	console.log(json);
}

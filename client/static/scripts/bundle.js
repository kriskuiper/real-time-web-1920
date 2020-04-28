const elements = {
	SEARCH_RESULTS: document.getElementById('spotify-search-results'),
	SEARCH_FORM: document.getElementById('spotify-search'),
	SEARCH_INPUT: document.getElementById('spotify-search-input')
};

elements.SEARCH_FORM.addEventListener('submit', async (event) => {
	event.preventDefault();

	const { value } = elements.SEARCH_INPUT;
	const response = await fetch(`/api/search?q=${value}`);
	const json = await response.json();

	console.log(json);
});

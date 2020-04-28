import { elements } from './lib/constants';

elements.SEARCH_FORM.addEventListener('submit', async (event) => {
	event.preventDefault();

	const { value } = elements.SEARCH_INPUT;
	const response = await fetch(`/api/search?q=${value}`);
	const json = await response.json();

	console.log(json);
})

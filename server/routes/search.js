const { search } = require('@lib/spotify-fetch');

module.exports = async (request, response) => {
	const searchQuery = request.query.q;

	try {
		const data = await search(request, searchQuery);

		response.json(data.tracks.items);
	} catch(error) {
		console.log(error);

		response.status(400).json({
			error
		})
	}
}

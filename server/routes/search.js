const { search } = require('@lib/spotify-fetch');

module.exports = async (request, response) => {
	const searchQuery = request.query.q;

	try {
		const tracks = await search(request, searchQuery);

		response.json(tracks)
	} catch(error) {
		console.log(error);

		response.status(400).json({
			error
		})
	}
}

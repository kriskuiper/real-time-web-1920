const { addToQueue } = require('@lib/spotify-fetch');

module.exports = async (request, response) => {
	const { uri } = request.query;

	try {
		await addToQueue(request, uri);
	} catch(error) {
		response.json({ error });
	}
}

module.exports = (request, response) => {
	const { party_id } = request.query;

	response.redirect(`/room-${party_id}`);
}

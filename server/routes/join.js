module.exports = (request, response) => {
	const { party_id } = request.query;

	response.redirect(`/party-${party_id}`);
}

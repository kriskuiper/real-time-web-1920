const { cookies } = require('@lib/constants');
const { getAccessToken } = require('@lib/get-spotify-tokens');
const generateRandomString = require('@lib/generate-random-string');

module.exports = async (request, response, next) => {
	const code = request.query.code || null;
	const state = request.query.state || null;
	const storedState = request.cookies && request.cookies[cookies.STATE_KEY] || null;

	response.clearCookie(cookies.STATE_KEY);

	if (state === null || state !== storedState) {
		response.status(500).send('Server error, state mismatch');
		return;
	}

	try {
		const { access_token, refresh_token } = await getAccessToken(code);
		const partyId = generateRandomString(10);

		response.cookie(cookies.ACCESS_TOKEN, access_token);
		response.cookie(cookies.REFRESH_TOKEN, refresh_token);

		response.redirect(`/party-${partyId}`);

	} catch(error) {
		next(error);
	}
}

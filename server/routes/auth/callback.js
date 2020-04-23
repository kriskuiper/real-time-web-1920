const { cookies } = require('@lib/constants');
const { getAccessToken } = require('@lib/get-spotify-tokens');
const generateRandomString = require('@lib/generate-random-string');
const { encryptToJWT } = require('@lib/jwt');

const partyService = require('@services/party');

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
		const hostId = generateRandomString(20);
		const encryptedPartyId = encryptToJWT(partyId);
		const encryptedHostId = encryptToJWT(hostId);
		const newParty = {
			partyId: partyId,
			accessToken: encryptToJWT(access_token),
			refreshToken: encryptToJWT(refresh_token),
			userId: hostId
		}

		partyService.create(newParty);

		response.cookie(cookies.PARTY_ID, encryptedPartyId);
		response.cookie(cookies.PARTY_UUID, encryptedHostId)

		response.redirect(`/party-${partyId}`);
	} catch(error) {
		next(error);
	}
}

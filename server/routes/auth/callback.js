const { cookies } = require('@lib/constants');
const { getAccessToken } = require('@lib/spotify-fetch');
const generateRandomString = require('@lib/generate-random-string');
const { encryptToJWT, decryptJWT } = require('@lib/jwt');

const partyService = require('@services/party');

module.exports = async (request, response, next) => {
	const code = request.query.code || null;
	const state = request.query.state || null;
	const storedState = request.cookies[cookies.STATE_KEY] || null;
	const storedUserIntention = request.cookies[cookies.USER_INTENTION];
	const partyIdJWT = request.cookies[cookies.PARTY_ID];
	const userIdJWT = request.cookies[cookies.PARTY_UUID];
	const storedPartyId = partyIdJWT && decryptJWT(partyIdJWT);
	const storedUserId = userIdJWT && decryptJWT(userIdJWT);

	const { access_token, refresh_token } = await getAccessToken(code);
	const accessToken = encryptToJWT(access_token);
	const refreshToken = encryptToJWT(refresh_token);

	response.clearCookie(cookies.STATE_KEY);

	response.cookie(cookies.ACCESS_TOKEN, accessToken);
	response.cookie(cookies.REFRESH_TOKEN, refreshToken);

	if (state === null || state !== storedState) {
		response.status(500).send('Server error, state mismatch');
		return;
	}

	if (storedUserIntention === 'join') {
		response.clearCookie(cookies.USER_INTENTION);

		try {
			await partyService.addUser(storedPartyId, storedUserId);
			response.redirect(`/party-${storedPartyId}`);
			return
		} catch(error) {
			console.log(error);
			return
		}
	}

	try {
		const { partyId, userId } = await createParty(accessToken, refreshToken);
		const encryptedPartyId = encryptToJWT(partyId);
		const encryptedUserId = encryptToJWT(userId);

		response.cookie(cookies.PARTY_ID, encryptedPartyId);
		response.cookie(cookies.PARTY_UUID, encryptedUserId);

		response.redirect(`/party-${partyId}`);
	} catch(error) {
		next(error);
	}
}

async function createParty(accessToken, refreshToken) {
	const partyId = generateRandomString(10);
	const userId = generateRandomString(20);
	const newParty = {
		partyId,
		accessToken,
		refreshToken,
		userId
	}

	await partyService.create(newParty);

	return { partyId, userId }
}

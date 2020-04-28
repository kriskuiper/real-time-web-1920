const partyService = require('@services/party');

const { encryptToJWT } = require('@lib/jwt');
const generateRandomString = require('@lib/generate-random-string');
const { cookies } = require('@lib/constants');

module.exports = async (request, response) => {
	try {
		const { party_id } = request.query;
		const { partyId } = await partyService.getIfExists(party_id);
		const userId = generateRandomString(20);

		response.cookie(cookies.PARTY_ID, encryptToJWT(partyId));
		response.cookie(cookies.PARTY_UUID, encryptToJWT(userId));
		response.cookie(cookies.USER_INTENTION, 'join');

		response.redirect('/auth/login');
	} catch(error) {
		console.log(error);

		response.redirect('/');
	}
}

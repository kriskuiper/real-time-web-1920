const fetch = require('node-fetch');
const queryString = require('query-string');

const partyService = require('@services/party');
const { spotify, cookies } = require('@lib/constants');
const { decryptJWT } = require('@lib/jwt');

exports.search = async (request, searchQuery) => {
	const accessToken = decryptJWT(request.cookies[cookies.ACCESS_TOKEN]);

	const query = queryString.stringify({
		q: searchQuery,
		type: 'track',
		market: 'from_token'
	});
	const url = `${spotify.SEARCH_BASEURL}?${query}`;
	const options = {
		method: 'GET',
		headers: {
			'Authorization': `Bearer ${accessToken}`
		}
	}

	try {
		const response = await fetch(url, options);
		const tracks = await response.json();

		return tracks;
	} catch(error) {
		throw error;
	}
}

exports.addToQueue = (request, songId) => {
	const partyId = decryptJWT(request.cookies[cookies.PARTY_ID]);

	return partyId;
}

function encodeToBase64(text) {
	return Buffer.from(text).toString('base64');
}

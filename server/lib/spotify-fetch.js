const fetch = require('node-fetch');
const queryString = require('query-string');

const { spotify } = require('@lib/constants');
const { decryptJWT } = require('@lib/jwt');

const {
	SPOTIFY_REDIRECT_URI,
	SPOTIFY_CLIENT_ID,
	SPOTIFY_CLIENT_SECRET
} = process.env;

exports.getAccessToken = async (code) => {
	const query = queryString.stringify({
		grant_type: 'authorization_code',
		code,
		redirect_uri: SPOTIFY_REDIRECT_URI
	});
	const options = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Authorization': `Basic ${encodeToBase64(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`)}`
		}
	};
	const url = `${spotify.TOKEN_BASEURL}?${query}`;

	try {
		const response = await fetch(url, options);
		const { access_token, refresh_token } = await response.json();

		return { access_token, refresh_token };
	} catch(error) {
		throw error;
	}
}

exports.getRefreshtoken = async (refreshToken) => {
	const query = queryString.stringify({
		grant_type: 'refresh_token',
		refresh_token: refreshToken
	});
	const options = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Authorization': `Basic ${encodeToBase64(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`)}`
		}
	}
	const url = `${spotify.TOKEN_BASEURL}?${query}`;

	try {
		const response = await fetch(url, options);
		const data = await response.json();

		return data
	} catch(error) {
		throw error;
	}
}

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

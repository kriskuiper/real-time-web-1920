const fetch = require('node-fetch');
const queryString = require('query-string');

const {
	SPOTIFY_REDIRECT_URI,
	SPOTIFY_CLIENT_ID,
	SPOTIFY_CLIENT_SECRET
} = process.env;

const { spotify } = require('@lib/constants');

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

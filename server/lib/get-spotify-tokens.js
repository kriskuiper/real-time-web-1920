const axios = require('axios');

const { spotify } = require('@lib/constants');
const {
	SPOTIFY_REDIRECT_URI,
	SPOTIFY_CLIENT_ID,
	SPOTIFY_CLIENT_SECRET
} = process.env;

exports.getAccessToken = async (code) => {
	const response = await axios({
		url: spotify.TOKEN_BASEURL,
		method: 'post',
		params: {
			grant_type: 'authorization_code',
			code,
			redirect_uri: SPOTIFY_REDIRECT_URI,
		},
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Authorization': `Basic ${encode(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`)}`
		}
	}).catch(error => {
		throw new Error(error);
	});

	return response.data
}

exports.refreshAccessToken = async (refreshToken) => {
	const response = await axios({
		url: spotify.TOKEN_BASEURL,
		method: 'post',
		params: {
			grant_type: 'refresh_token',
			refresh_token: refreshToken,
		},
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Authorization': `Basic ${encode(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`)}`
		}
	}).catch(error => {
		throw new Error(error);
	});

	return response.data
}

function encode(text) {
	return Buffer.from(text).toString('base64')
}

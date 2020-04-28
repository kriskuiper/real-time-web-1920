const generateRandomString = require('@lib/generate-random-string');
const { cookies, spotify } = require('@lib/constants');

const { SPOTIFY_CLIENT_ID, SPOTIFY_REDIRECT_URI } = process.env;

module.exports = (request, response, next) => {
	const randomString = generateRandomString(11);
	const spotifyBaseUrl = `${spotify.AUTH_BASEURL}?response_type=code`
	const scopes = encodeURIComponent('user-read-playback-state user-modify-playback-state user-read-private');
	const redirectURI = encodeURIComponent(SPOTIFY_REDIRECT_URI);
	const	redirectURL = `${spotifyBaseUrl}&client_id=${SPOTIFY_CLIENT_ID}&scope=${scopes}&redirect_uri=${redirectURI}&state=${randomString}`;

	response.cookie(cookies.STATE_KEY, randomString);

	response.redirect(redirectURL);
}

exports.ports = {
	DEFAULT: 3000
};

exports.spotify = {
	AUTH_BASEURL: 'https://accounts.spotify.com/authorize',
	TOKEN_BASEURL: 'https://accounts.spotify.com/api/token',
	SEARCH_BASEURL: 'https://api.spotify.com/v1/search',
	ADD_TO_QUEUE_BASEURL: 'https://api.spotify.com/v1/me/player/queue',
	USER_BASEURL: 'https://api.spotify.com/v1/me'
};

exports.cookies = {
	STATE_KEY: 'stateKey',
	PARTY_ID: 'partyId',
	PARTY_UUID: 'partyUUID',
	ACCESS_TOKEN: 'accessToken',
	REFRESH_TOKEN: 'refreshToken',
	USER_INTENTION: 'userIntention'
};

exports.errors = {
	UNAUTHORIZED: 'Sorry, seems like you are unauthorized'
}

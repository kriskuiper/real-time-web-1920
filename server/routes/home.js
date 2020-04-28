const renderer = require('@lib/renderer');
const { cookies } = require('@lib/constants');

module.exports = (request, response) => {
	for (cookie of Object.keys(request.cookies)) {
		if (isPartyCookie(cookie)) {
			response.clearCookie(cookie);
		}
	}

	response.send(renderer.render('pages/index.html'));
}

function isPartyCookie(cookie) {
	return cookie === cookies.PARTY_ID ||
		cookie === cookies.PARTY_UUID ||
		cookie === cookies.USER_INTENTION
}

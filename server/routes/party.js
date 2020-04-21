const renderer = require('@lib/renderer');
const socket = require('socket.io');

const activeRooms = {};

module.exports = (request, response) => {
	const { accessToken, refreshToken } = request.cookies

	if (!accessToken && !refreshToken) {
		/*
			@TODO: Let the user know they're not invited to the party
		*/

		response.redirect('/')
	}

	const { id } = request.params;

	response.send(renderer.render('pages/party.html', { id }));
}

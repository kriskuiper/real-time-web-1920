const renderer = require('@lib/renderer');
const socket = require('socket.io');

const activeRooms = {};

module.exports = (request, response) => {
	const { id } = request.params;

	response.send(renderer.render('pages/party.html', { id }));
}

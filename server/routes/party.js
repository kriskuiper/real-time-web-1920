const renderer = require('@lib/renderer');
const ioInstance = require('@lib/io-instance');
const { cookies } = require('@lib/constants');
const { decryptJWT } = require('@lib/jwt');
const partyService = require('@services/party');

module.exports = (request, response) => {
	const { id } = request.params;

	ioInstance.io.on('connection', (socket) => {
		socket.on('disconnect', async () => {
			const uuid = request.cookies[cookies.PARTY_UUID];
			const partyId = request.cookies[cookies.PARTY_ID];
			const decryptedUUID = decryptJWT(uuid);
			const decryptedPartyId = decryptJWT(partyId);

			await partyService.removeUser(decryptedPartyId.token, decryptedUUID.token);
		});
	})

	response.send(renderer.render('pages/party.html', { id }));
}

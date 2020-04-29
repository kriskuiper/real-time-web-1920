const renderer = require('@lib/renderer');
const ioInstance = require('@lib/io-instance');
const { cookies } = require('@lib/constants');
const { decryptJWT } = require('@lib/jwt');
const { addToQueue } = require('@lib/spotify-fetch');
const partyService = require('@services/party');

module.exports = (request, response) => {
	const { id } = request.params;

	ioInstance.io.on('connection', (socket) => {
		const roomId = `party-${id}`;

		socket.join(roomId);

		socket.on('add to queue', ({ uri }) => {
			addToQueue(request, uri)
				.then(() => {
					ioInstance.io.to(roomId).emit('added to queue', { uri });
				})
				.catch(() => null);
		});

		socket.on('disconnect', async () => {
			// Do we certainly want to remove the user on disconnect?

			const uuid = request.cookies[cookies.PARTY_UUID];
			const partyId = request.cookies[cookies.PARTY_ID];
			const decryptedUUID = decryptJWT(uuid);
			const decryptedPartyId = decryptJWT(partyId);

			try {
				await partyService.removeUser(decryptedPartyId, decryptedUUID);
			} catch {
				return null
			}
		});
	})

	response.send(renderer.render('pages/party.html', { id }));
}

const renderer = require('@lib/renderer');
const ioInstance = require('@lib/io-instance');
const { cookies } = require('@lib/constants');
const { decryptJWT } = require('@lib/jwt');
const { addToQueue, getUserData } = require('@lib/spotify-fetch');
const partyService = require('@services/party');
const parties = {};

module.exports = async (request, response) => {
	const { id } = request.params;
	const roomId = `party-${id}`;
	const decryptedPartyId = request.cookies[cookies.PARTY_ID] &&
		decryptJWT(request.cookies[cookies.PARTY_ID]);
	const decryptedUserId = request.cookies[cookies.PARTY_UUID] &&
		decryptJWT(request.cookies[cookies.PARTY_UUID]);
	const namespace = ioInstance.io.of(`/${roomId}`);
	const user = await getUserData(request);

	request.session.username = user && user.display_name || 'unknown';

	namespace.on('connection', async (socket) => {
		try {
			const user = await partyService.findUser(decryptedPartyId, decryptedUserId);

			if (user && user.type === 'host') {
				if (!parties[decryptedPartyId]) {
					parties[decryptedPartyId] = {
						hostSocketId: socket.id,
						queue: {}
					};
					socket.to(parties[decryptedPartyId].hostSocketId).join(roomId);
				}
			} else {
				const { hostSocketId } = parties[decryptedPartyId];
				const currentSocket = socket.id;
				const { queue } = parties[decryptedPartyId];
				const isInQueue = queue[currentSocket];

				if (!isInQueue) {
					queue[currentSocket] = {
						username: request.session.username,
						socketId: currentSocket
					}

					socket.to(hostSocketId).emit('join', {
						username: request.session.username,
						socketId: currentSocket
					})
				}
			}

		} catch(error) {
			console.log(error);
		}

		socket.on('join', ({ socketId }) => {

		})

		socket.on('allowed', ({ socketId }) => {
			socket.to(socketId).join(roomId);

			partyService.addUser(decryptedPartyId, decryptedUserId)
				.then(() => {
			socket.to(socketId).emit('allowed');
				});
		});

		socket.on('disallowed', ({ socketId }) => {
			socket.to(socketId).emit('disallowed');
		});

		socket.on('add to queue', ({ uri }) => {
			addToQueue(request, uri)
				.then(() => {
					ioInstance.io.to(roomId).emit('added to queue', { uri });
					ioInstance.io.to(roomId).emit('server message', {
						message: '{user} added {song name} to the queue'
					})
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

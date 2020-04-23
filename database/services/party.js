const mongoose = require('mongoose');
const Party = require('@models/Party');

exports.getIfExists = async (partyId) => {
	try {
		const party = await Party.findOne({ partyId });

		if (party) {
			return party;
		}

		throw `Party with id ${partyId} not found.`;
	} catch(error) {
		throw new Error(error);
	}
}

exports.create = async ({ partyId, accessToken, refreshToken, userId }) => {
	const user = {
		userId,
		type: 'host'
	}

	try {
		const newParty = new Party({
			_id: new mongoose.Types.ObjectId(),
			partyId: partyId,
			accessToken,
			refreshToken,
			users: [user]
		});

		await newParty.save();

		return 'Successfully created party';
	} catch(error) {
		throw new Error(error)
	}
}

exports.remove = async (id) => {
	try {
		await Party.deleteOne({ partyId: id })

		return 'Successfully removed party'
	} catch(error) {
		throw new Error(error);
	}
}

exports.addUser = async (partyId, userId) => {
	try {
		const party = await Party.findOne({ partyId });

		if (party) {
			party.users = [
				...party.users,
				{ userId, type: 'guest' }
			]

			await party.save();

			return `Successfully added user to party ${partyId}`;
		}

		throw new Error(`Party with id ${partyId} does not exist.`);
	} catch(error) {
		throw new Error(error);
	}
}

exports.removeUser = async (partyId, userId) => {
	try {
		const party = await Party.findOne({ partyId });

		if (party) {
			party.users = party.users.filter(user => user.userId !== userId);

			console.log(party.users.length);

			await party.save();

			if (party.users.length === 0) {
				await this.remove(partyId);
			}

			return 'Successfully removed user from party';
		}

		throw new Error(`Party with id ${partyId} does not exist.`)
	} catch(error) {
		throw new Error(error);
	}
}

exports.getTokens = async (partyId) => {
	try {
		const party = await Party.findOne({ partyId });

		if (party) {
			return {
				accessToken: party.accessToken,
				refreshToken: party.refreshToken
			};
		}

		throw new Error(`Party with id ${partyId} does not exist.`);
	} catch(error) {
		throw new Error(error);
	}
}

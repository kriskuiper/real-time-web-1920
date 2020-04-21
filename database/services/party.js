const Party = require('@models/Party');
const { DatabaseError } = require('../index');

exports.getIfExists = async (partyId) => {
	const party = await Party.find({ partyId });

	return party || null
}

exports.create = async ({ id, accessToken, refreshToken, hostUser }) => {
	const user = {
		...hostUser,
		type: 'host'
	}

	try {
		const newParty = new Party({
			_id: new mongoose.Types.ObjectId(),
			partyId: id,
			accessToken,
			refreshToken,
			users: [user]
		});

		await newParty.save();

		return Promise.resolve('Successfully created party');
	} catch(error) {
		throw new DatabaseError(error)
	}
}

exports.remove = async (id) => {
	try {
		await Party.deleteOne({ partyId: id })
	} catch(error) {
		throw new DatabaseError(error);
	}
}

exports.addUser = async (partyId, user) => {
	try {
		const party = await Party.find({ partyId });

		if (party) {
			party.users.push(user);
			await party.save();

			return Promise.resolve(`Successfully added user to party ${partyId}`);
		}

		throw new Error(`Party with id ${partyId} does not exist.`);
	} catch(error) {
		throw new DatabaseError(error);
	}
}

exports.removeUser = async (partyId, user) => {
	try {
		const party = await Party.find({ partyId });

		if (party) {
			const userIndex = party.users.indexOf(user);

			party.users.splice(userIndex, 1);
			await party.save();

			return Promise.resolve('Successfully removed user from party');
		}

		throw new Error(`Party with id ${partyId} does not exist.`)
	} catch(error) {
		throw new DatabaseError(error);
	}
}

exports.getTokens = async (partyId) => {
	try {
		const party = await Party.find({ partyId });

		if (party) {
			return Promise.resolve({
				accessToken: party.accessToken,
				refreshToken: party.refreshToken
			});
		}

		throw new Error(`Party with id ${partyId} does not exist.`);
	} catch(error) {
		throw new DatabaseError(error);
	}
}

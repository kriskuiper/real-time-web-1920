const { ObjectId, Schema, model } = require('mongoose');

const partySchema = new Schema({
	_id: ObjectId,
	partyId: {
		type: String,
		required: true
	},
	accessToken: {
		type: String,
		required: true
	},
	refreshToken: {
		type: String,
		required: true
	},
	users: {
		type: Array,
		default: []
	},
	songs: {
		type: Array,
		default: []
	}
});

module.exports = model('Party', partySchema);

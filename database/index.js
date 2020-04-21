const mongoose = require('mongoose');

const { MONGODB_URI } = process.env;

exports.connect = () => {
	return mongoose
		.connect(MONGODB_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true
		})
		.catch(handleConnectionError)
}

function handleConnectionError(error) {
	throw new Error('Unable to connect to database', error);
}

exports.DatabaseError = (error) => {
	return new Error('Database error: ', error);
}

const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

exports.encryptToJWT = (token) => {
	return jwt.sign({ token }, JWT_SECRET);
}

exports.decryptJWT = (jsonWebToken) => {
	return jwt.verify(jsonWebToken, JWT_SECRET);
}

const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

exports.encryptToJWT = (value) => {
	const token = jwt.sign({ value }, JWT_SECRET);
	return token;
}

exports.decryptJWT = (jsonWebToken) => {
	const { value }  = jwt.verify(jsonWebToken, JWT_SECRET);
	return value;
}

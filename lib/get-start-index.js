const { MAX_AMOUNT_OF_MESSAGES } = require('./constants');

module.exports = (index) => {
	return index < MAX_AMOUNT_OF_MESSAGES ? 0 : index - MAX_AMOUNT_OF_MESSAGES;
}

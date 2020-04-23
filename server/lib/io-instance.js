const socket = require('socket.io');

class ioInstance {
	constructor() {
		this.io = null;
	}

	create(server) {
		this.io = socket(server);
	}
}

module.exports = new ioInstance;

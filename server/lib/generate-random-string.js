module.exports = (length) => {
	const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	let randomString = '';

	for (let index = 0; index < length; index++) {
		const randomInteger = Math.floor(Math.random() * possible.length);
		const randomLetter = possible[randomInteger];

		randomString += randomLetter;
	}

	return randomString;
}

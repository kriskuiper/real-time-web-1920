module.exports = [
	{
		input: 'client/assets/js/index.js',
		output: {
			file: 'client/static/scripts/bundle.js'
		},
		format: 'cjs'
	},
	{
		input: 'client/assets/js/socket.js',
		output: {
			file: 'client/static/scripts/socket.js'
		}
	}
]

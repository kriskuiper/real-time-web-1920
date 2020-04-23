import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from 'rollup-plugin-terser';

const production = !process.env.ROLLUP_WATCH;

module.exports = [
	{
		input: 'client/assets/js/index.js',
		output: {
			file: 'client/static/scripts/bundle.js'
		},
		format: 'cjs',
		plugins: [
			resolve(),
			commonjs(),
			production && terser()
		]
	},
	{
		input: 'client/assets/js/socket.js',
		output: {
			file: 'client/static/scripts/socket.js'
		},
		plugins: [
			resolve(),
			commonjs(),
			production && terser()
		]
	}
]

import Cookies from 'js-cookie';

export default {
	set(key, value, options = null) {
		if (options) {
			return Cookies.set(key, value, options);
		}

		return Cookies.set(key, value);
	},
	get(key) {
		return Cookies.get(key)
	},
	remove(key) {
		return Cookies.remove(key);
	}
}

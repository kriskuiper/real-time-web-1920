const renderer = require('@lib/renderer');

module.exports = (request, response) => {
	response.send(renderer.render('pages/index.html'));
}

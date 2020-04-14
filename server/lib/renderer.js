const Nunjucks = require('nunjucks');

module.exports = new Nunjucks.Environment(
	new Nunjucks.FileSystemLoader('client')
);

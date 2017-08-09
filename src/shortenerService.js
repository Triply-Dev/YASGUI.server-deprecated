var shortenerFactory = require('./shortener.js'),
	config = require('./config.js');



module.exports = function(app) {
  shortenerFactory.init(function(err, shortener) {
    if (err) {
      return console.log("failed initializing shortener", err);
    }
		app.use('/shorten', function(req, res) {
			res.setHeader('Access-Control-Allow-Headers', 'accept, authorization, content-type, x-requested-with');
			res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
			res.setHeader('Access-Control-Allow-Origin', req.header('origin') || '*');
			if (!req.query.url) {
				return res.status(400).send('Add ?url as URL argument');
			}
			shortener.shorten(req.query.url, function(err, result) {
				if (err) {
					return res.status(500).send(err.err);
				}
				return res.send(config.server.shortUrlBasename + result.short);
			})
		})
		app.get('/short/:short/url',
		function (req, res, next) {
			res.setHeader('Access-Control-Allow-Headers', 'accept, authorization, content-type, x-requested-with');
			res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
			res.setHeader('Access-Control-Allow-Origin', req.header('origin') || '*');
			next();
		},
		function(req, res) {
			shortener.fetch(req.params.short, function(err, result) {
				if (err) return res.status(500).send(err.err);
				if (!result) return res.status(404).send('No URL found for ' + req.protocol + '://' + req.get('host') + req.originalUrl);
				res.send(result.url);
			})
		}
	)
		app.use('/short/:short', function(req, res) {
			shortener.fetch(req.params.short, function(err, result) {
				if (err) return res.status(500).send(err.err);
				if (!result) return res.status(404).send('No URL found for ' + req.protocol + '://' + req.get('host') + req.originalUrl);
				return res.redirect(result.url);
			})
		})
  })
}

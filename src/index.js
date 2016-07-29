var express = require('express'),
	http = require('http'),
	serveStatic = require('serve-static'),
	bodyParser = require('body-parser'),
	extend = require('deep-extend'),
	fs = require('fs'),
	config = require('./config.js'),
	manifest = require('./manifest');

var dev = !!process.env.yasguiDev;
var yasguiDir = __dirname + '/../node_modules/yasgui';
var app = express();
var urlencodedParser = bodyParser.urlencoded({ extended: false })

var argv = require('minimist')(process.argv.slice(2));

if (argv.config) {
	//extend current config with the additional one
	extend(config, require(argv.config));
}


//js and css dependencies
app.use('/dist/', serveStatic(config.server.yasguiAssets, {index:false}));
//not really needed, but nice to have anyway
app.use('/doc/', serveStatic(yasguiDir + '/doc/'))

//the URLs for the API
app.use('/proxy/', urlencodedParser, require('./corsProxy.js'));

app.use('/index.html.manifest', function(req,res) {
	res.type('text/plain');
	res.send(manifest.get(dev));
});

//Finally, just render yasgui
app.use(/^\/$/, function(req,res, next) {
	res.sendFile('index.html', {root: __dirname + '/../'});
});
require('./shortenerService.js')(app);
http.createServer(app).listen(config.server.port)

console.log('Running YASGUI on http://localhost:' + config.server.port);

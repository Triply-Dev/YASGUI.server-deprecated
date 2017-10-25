var http = require('follow-redirects').http,
	https = require('follow-redirects').https,
	querystring = require('querystring'),
	url = require('url');

var proxyHeaders = [
	'content-type',
	'content-disposition',
	'content-encoding',
	'content-language',
	'content-length',
	'date'
];
module.exports = function(req, res) {
	if (req.method == 'GET') {
		res.statusCode = 405;
		return res.end('GET request not supported');
	}

	var arguments = req.body;
	var acceptHeader = '*/*';
	if (req.headers.accept) acceptHeader = req.headers.accept;
	var requestMethod = "POST";
	if (arguments.requestMethod) {
		requestMethod = arguments.requestMethod;
		delete arguments["requestMethod"];
	}

	if (!arguments.endpoint) {
		res.statusCode = 400;
		return res.end('Missing endpoint reference to proxy');
	}
	var endpoint = arguments.endpoint;
	delete arguments["endpoint"];

	var parsedEndpoint = url.parse(endpoint);

	delete req.headers['content-type'];
	delete req.headers['content-length'];

	var endpointReqOptions = {
		host: parsedEndpoint.hostname,
		port: parsedEndpoint.port,
		path: parsedEndpoint.path,
		headers:  req.headers,
		method: requestMethod,
	}

	endpointReqOptions.headers.host = endpointReqOptions.host;
	endpointReqOptions.headers['accept'] = acceptHeader;
	var postData = null;
	if (requestMethod == "GET") {
		var appendedQuery = "";
		if (endpointReqOptions.path.indexOf("?") >= 0) {
			appendedQuery = "&";
		} else {
			appendedQuery = "?";
		}
		appendedQuery += querystring.stringify(arguments);
		endpointReqOptions.path += appendedQuery;
	} else {
		postData = querystring.stringify(arguments);
		endpointReqOptions.headers['content-type'] = 'application/x-www-form-urlencoded';
		endpointReqOptions.headers['content-length'] = postData.length;
	}
	var protocolReq = http;
	if (parsedEndpoint.protocol == "https:") {
		protocolReq = https;
	}

	var proxyReq = protocolReq.request(endpointReqOptions, function(proxyRes) {
		proxyHeaders.forEach(function(header){
			if (header in proxyRes.headers) res.setHeader(header, proxyRes.headers[header]);
		});
		res.statusCode = proxyRes.statusCode;
		proxyRes.on('data', function(chunk) {
			res.write(chunk);
		});
		proxyRes.on('end', function() {
			res.end();
		});
	});
	if (postData) proxyReq.write(postData);
	proxyReq.on('error', function (err) {
		//If any error is encountered during the request (be that with DNS resolution, TCP level errors,
		//or actual HTTP parse errors) an 'error' event is emitted on the returned request object.
		//We used to send code 0 here, but that's not allowed anymore by express... It needs to be a valid status code
		//i.e. >=1xx and <= 5xx
		console.error('Proxy error', err)
		res.statusCode = 502;//bad gateway
		res.end();
	});
	proxyReq.end();




};

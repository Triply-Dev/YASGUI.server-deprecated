[![NPM](https://img.shields.io/npm/v/yasgui-server.svg)](https://www.npmjs.org/package/yasgui-server)

# YASGUI Server
YASGUI (Yet Another SPARQL GUI) is part of the the YASGUI family of tools.
For more information about the YASGUI client, its features, and how to include it in your web site, visit [http://doc.yasgui.org][1].
To give YASGUI a try, visit [http://yasgui.org][2].

This repository provides a YASGUI backend, and provides the following extra functionality to the YASGUI client:

* URL shortener for sharing queries
* A proxy for accessing endpoints that are not CORS-enabled
* Perhaps more in the future

# Running the YASGUI server

* `npm install`
* `npm run start`

## Developing YASGUI


Feel free to fork and develop this tool. If you have anything to contribute, submit a pull request.
To develop this tool locally, I'd advice to run YASGUI via `npm run dev`, as it disables some HTML5 appcache manifest caching, and automatically restarts the server on code changes.


  [1]: http://doc.yasgui.org
  [2]: http://yasgui.org

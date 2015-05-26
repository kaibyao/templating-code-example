var http = require('http');

var config = require("../config");

var Server = function(conf) {
	conf = conf || config;

	this.config = conf;
};

Server.prototype = {
	start: function( responseCallback ) {
		var port = this.config.port;

		if ( !responseCallback ) {
			responseCallback = function( request, response ) { console.log( request, response ); };
		}

		http.createServer( responseCallback ).listen( port );
		console.log( 'listening on port ' + port );
	}
};

module.exports = Server;

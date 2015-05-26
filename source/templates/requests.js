
var Responses = require("./responses");

var Requests = function(responses) {
	responses = responses || new Responses();

	this.responses = responses;
};

Requests.prototype = {
	setup: function( requestObj ) {
		requestObj.setEncoding();
	},

	handleRequest: function( requestObj, responseObj ) {
		var self = this,
			result = '';

		this.setup( requestObj );

		requestObj.on( 'data', function(data) {
			result += data;
		} );

		requestObj.on( 'end', function () {
			self.responses.respond( responseObj, result );
		} );
	}

};

module.exports = Requests;

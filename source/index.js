var Server = require("./utilities/server"),
	Files = require("./utilities/files"),
	Hoganizer = require("./utilities/hoganize"),
	Languifier = require("./utilities/languify"),
	Requests = require("./templates/requests"),
	Responses = require("./templates/responses");

// Export the Public Facing API
module.exports = {
	Server: Server,
	Files: Files,
	Hoganizer: Hoganizer,
	Languifier: Languifier,
	Requests: Requests,
	Responses: Responses,

	start: function(conf) {
		conf = conf || require("./config");

		var requests = new Requests();

		new Server(conf).start( function() {
			requests.handleRequest.apply(requests, arguments);
		});
	}
};
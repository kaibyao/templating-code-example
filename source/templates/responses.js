var q = require( 'q' ),
	_ = require("underscore");

var config = require("../config"),
	Languifier = require("../utilities/languify"),
	Files = require("../utilities/files"),
	Hoganizer = require("../utilities/hoganize");

var Responses = function(conf, headers) {
	// These functions are passed as handlers to the http object and have had their 'this' manipulated.
	_.bindAll(this, "processTemplatesLive", "processTemplatesProduction", "sendResponse");

	conf = conf || config;
	headers = headers || {
		// 'Content-Encoding' : 'gzip',
		'Content-Type' : 'text/plain'
	};

	this.config = conf;
	this.responseHeaders = headers;

	this.stamp = '{' + new Date().getTime() + '} ';
};

Responses.prototype = {
	_log: function(msg) {
		console.log(this.stamp + msg);
	},

	setResponseError: function( response, error ) {
		console.log(error);
		
		response.status = 'error';
		response.error = error;
		response.version = null;
		response.yeahbrotha = {};
	},

	respond: function( responseObj, data ) {
		var self = this,
			response = {
				status : null,
				error : null,
				version : null,
				yeahbrotha : {}
			};

		try {
			data = JSON.parse( data );
		} catch ( error ) {

			this.setResponseError( response, error );
			this.sendResponse( responseObj, response );
			return;
		}

		this.startResponse( data, responseObj, response ).then(
			function( gzippedResponse ) {
				self.sendResponse( responseObj, gzippedResponse );
			},
			function( error ) {
				self.setResponseError( response, error );
				self.sendResponse( responseObj, response );
			}
		);

		return this.startResponse;
	},

	_getFiles: function() {
		return new Files();
	},

	startResponse: function( data, responseObj, response ) {
		var	processTemplates = ( this.config.environment === 'production' ) ? this.processTemplatesProduction : this.processTemplatesLive,
			defer = q.defer(),
			// So it can be unit tested, moved to _getFiles
			files = this._getFiles();

		files.getTemplates(
			data,
			response
		).then(
			function( templates ) {
				processTemplates( data, responseObj, response, defer )( templates );
			},
			function( error ) {
				defer.reject( error );
			}
		);

		return defer.promise;
	},

	processTemplatesLive: function( data, responseObj, response, defer ) {
		var self = this;

		return function( templates ) {
			var stringify = "",
				languifier = new Languifier(),
				hoganizer = new Hoganizer();

			try {
				self._log('Running Mustache to languify templates');
				templates = languifier.languifyTemplates( data, templates );
			} catch(e) {
				return defer.reject(e);
			}

			self._log('Running Hogan on templates');
			hoganizer.getHoganizedTemplates( templates, function(err, hoganized) {
				if(err) {
					return defer.reject(err);
				}

				response.yeahbrotha = hoganized;

				response.status = 'ok';
			
				// Run the callback
				defer.resolve(response);
			});
		};
	},

	processTemplatesProduction: function( data, responseObj, response ) {
		this.sendResponse( responseObj, response ); // for future production environment
	},

	sendResponse: function( responseObj, response ) {
		if(_.isFunction(responseObj)) {
			// allow callback style response

			this._log('Machete has ran successfully [callback]');
			responseObj(response);
		} else {
			if(response.status === "error") {
				this.responseHeaders['Content-Encoding'] = null;
				responseObj.writeHead( 500, this.responseHeaders );
				responseObj.write( response.error.toString() );
				responseObj.end();
			} else {
				if(!response.yeahbrotha || response.yeahbrotha.length < 1) {
					responseObj.writeHead( 404, this.responseHeaders );
					responseObj.write( response );
					responseObj.end();
				} else {
					var stringify = JSON.stringify( response );
					this._log('Machete has ran successfully [server]');

					responseObj.writeHead( 200, this.responseHeaders );
					responseObj.write( stringify );
					responseObj.end();
				}
			}
		}
	}
};

module.exports = Responses;

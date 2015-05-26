var fs = require("fs"),
	crypto = require("crypto"),
	zlib = require("zlib");

var q = require("q");

var Files = function(config) {
	config = config || require("../config");

	this.config = config;
};

Files.prototype = {
	getTemplatePath: function( version , root ) {
		root || (root = '');

		version || (version = 'default');
		version = version.toLowerCase();
		
		return root + this.config.paths.templates +'/'+ version;
	},

	getTemplates: function( data, response, callback ) {
		var filepath = this.getTemplatePath( 'default', data.root || "" ),
			templatesRequested = data[ 'templates' ],
			templates = {},
			deferred = q.defer(),
			numTemplates,
			numLoaded = [],
			i;

		if ( templatesRequested ) {
			numTemplates = templatesRequested.length;

			for ( i = 0; i < numTemplates; i++ ) {
				try {
					this._readFile(
						filepath +'/'+ templatesRequested[ i ] + '.stache',
						'utf-8',
						this.onFileRead( templates, response, deferred, numTemplates, templatesRequested[ i ], numLoaded )
					);
				} catch ( error ) {
					response.status = 'error';
					response.error = 'files.readFile( '+ filepath +' ): ' + error;
					deferred.reject( error );

					i = numTemplates;
				}
			}
		} else {
			deferred.reject( 'files.getTemplates: templatesRequested is falsy.' );
		}

		return deferred.promise;
	},

	_readFile: function(fileName, encoding, callback) {
		// Pass through, but separated for unit testing.
		fs.readFile(fileName, encoding, callback);
	},

	onFileRead: function( templates, response, deferred, numTemplates, templateName, numLoaded ) {
		return function( err, template ) {
			if ( err ) {
				response.status = 'error';
				response.error = 'files.onFileRead: ' + err;

				deferred.reject( err );
			} else {
				templates[ templateName ] = template;
				numLoaded.push( 1 );
				if ( numLoaded.length === numTemplates ) {
					deferred.resolve( templates );
				}
			}
		};
	},

	shaIt: function( string ) {
		return crypto.createHash( 'sha1' ).update( string ).digest( 'hex' );
	},

	gzipIt: function( string, callback ) {
		zlib.gzip( string, callback );
	}
};

module.exports = Files;
var Responses = require( '../source/templates/responses' ),
	Files = require("../source/utilities/files"),
	q = require( 'q' );

module.exports = {
	setUp : function ( callback ) {
		callback();
	},
	tearDown : function ( callback ) {
		// clean up
		callback();
	},
	responses : {
		'respond' : function ( test ) {
			var responseObj = {},
				responses = new Responses(),
				data = '',
				tempDefer = q.defer(),
				errorSet = false;
			
			responses.sendResponse = function() {};
			responses.setResponseError = function() { errorSet = true; };
			responses.sendResponse = function( response, error ) { test.ok( errorSet, 'sets and returns an error when JSON.parse syntax error occurs.'); };
			
			test.expect( 3 );
			
			responses.respond( responseObj, data );

			data = JSON.stringify( 'data' );

			responses.startResponse = function() { test.ok( true, 'response starts when data is parsed.' ); return tempDefer.promise; };
			responses.respond( responseObj, data );

			errorSet = false;
			responses.sendResponse = function( response, error ) { test.ok( errorSet, 'sets and returns an error when startResponse fails.' ); test.done(); };
			
			tempDefer.reject( 'error' );
		},
		'startResponse' : function ( test ) {
			var responses = new Responses({environment: ""}),
				tempDefer = q.defer(),
				tempDefer2 = q.defer(),
				tempCall,
				files = new Files();
			
			responses._getFiles = function() {
				return files;
			};

			test.expect( 2 );

			files.getTemplates = function() { return tempDefer2.promise; };
			responses.processTemplatesLive = function() { test.ok( true, 'does live environment processing when config is not set to production and templates retrieved.' ); };
			responses.startResponse( {}, {}, {} );
			
			tempDefer2.resolve();

			files.getTemplates = function() { return tempDefer.promise; };
			tempCall = responses.startResponse( {}, {}, {} );
			tempCall.fail( function() { 
				test.ok( true, 'fails the whole response when templates are not retrieved.' ); 
				test.done(); 
			});
			tempDefer.reject( 'error' );
		},
		'startResponseProduction' : function ( test ) {
			test.done();
		},
		'sendResponse' : function ( test ) {
			test.done();
		}
	}
};

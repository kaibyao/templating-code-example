var events = require("events");

var Requests = require( '../source/templates/requests' );

var makeMockRequestObj = function(test) { 
	var emitter = new events.EventEmitter();

	emitter.setEncoding = function() { test.ok( true, 'sets encoding.' ); };

	return emitter;
};

module.exports = {
	setUp : function ( callback ) {
		callback();
	},
	tearDown : function ( callback ) {
		callback();
	},
	requests : {
		'setup' : function( test ) {
			var reqObj = makeMockRequestObj(test),
				requests = new Requests();

			test.expect( 1 );

			// This should call the setEncoding which has a test.ok set in makeMockRequestObj
			requests.setup( reqObj );
			
			test.done();
		},

		'onData' : function ( test ) {
			var reqObj = makeMockRequestObj(test),
				respObj = {resp: true},
				requests = new Requests(),
				i;

			requests.responses.respond = function(respObj, result) {
				test.ok(respObj.resp, "Passed respObj");
				test.equal(result, "la la la test", "Concatenates data");
			};

			test.expect( 3 );

			requests.handleRequest(reqObj, respObj);

			reqObj.emit("data", 'la la la');
			reqObj.emit("data", ' test');
			reqObj.emit("end");

			test.done();
		},

		'handleRequest' : function ( test ) {
			test.done();
		}
	}
};

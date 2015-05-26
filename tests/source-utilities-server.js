var Server = require( '../source/utilities/server');

/*
======== A Handy Little Nodeunit Reference ========
https://github.com/caolan/nodeunit

Test methods:
	test.expect(numAssertions)
	test.done()
Test assertions:
	test.ok(value, [message])
	test.equal(actual, expected, [message])
	test.notEqual(actual, expected, [message])
	test.deepEqual(actual, expected, [message])
	test.notDeepEqual(actual, expected, [message])
	test.strictEqual(actual, expected, [message])
	test.notStrictEqual(actual, expected, [message])
	test.throws(block, [error], [message])
	test.doesNotThrow(block, [error], [message])
	test.ifError(value)
*/

module.exports = {
	setUp : function ( callback ) {
		callback();
	},
	tearDown : function ( callback ) {
		// clean up
		callback();
	},
	server : {
		'exists': function(test) {
			test.ok(Server, 'exists');
			test.ok(new Server(), 'instantiates');
			test.ok(new Server().start, 'has start');

			test.done();
		},

		'start' : function ( test ) {
			// TODO: ?
			test.done();
		}
	}
};

var Languifier = require( '../source/utilities/languify' );

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
	languify : {
		'exists': function(test) {
			test.ok(Languifier, "Class");
			test.ok(new Languifier(), "Instantiation");

			test.done();
		},
		'languifyTemplates' : function ( test ) {
			var languifier = new Languifier();

			test.ok(languifier.languifyTemplates, "exists");

			var data = {
					grammar: {
						"one": "uno",
						"two": "dos",
						"another": "otro"
					}
				},
				templates = {
					one: 'This is template [[#lang]][[one]][[/lang]].',
					two: 'This is template [[#lang]][[two]][[/lang]] with [[#lang]][[another]][[/lang]] lang variable.',
					three: '[[#lang]]This is a wrapped template with [[one]] and [[two]].[[/lang]]'
				};

			var result = languifier.languifyTemplates(data, templates);

			test.equal(result["one"], "This is template uno.", "template one");
			test.equal(result["two"], "This is template dos with otro lang variable.", "template two");
			test.equal(result["three"], "This is a wrapped template with uno and dos.", "template three");

			test.done();
		}
	}
};

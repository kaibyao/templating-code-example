/*jshint evil:true*/

var _ = require("underscore"),
	Hogan = require("hogan.js");

var Hoganizer = require( '../source/utilities/hoganize' ),
	CacheSwap = require('../source/utilities/cacheSwap');

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
		
		// Clear any cached templates
		var swap = new CacheSwap();
		swap.clear(null, callback);
		
	},
	tearDown : function ( callback ) {
		// clean up
		callback();
	},
	hoganize : {
		'exists' : function ( test ) {
			test.ok(Hoganizer, "exists");
			test.ok(new Hoganizer(), "instantiates");

			test.done();
		},

		'getHoganizedTemplates': function(test) {
			var hoganizer = new Hoganizer();

			test.ok(hoganizer.getHoganizedTemplates, "getHoganizedTemplates exists");

			var templates = {
				one: "This is a valid template.",
				two: "This is also a valid template with {{somevalue}} in it."
			};

			hoganizer.getHoganizedTemplates(templates, function(err, result) {
				if(err) {
					throw err;
				}

				test.equal(_.size(result), _.size(templates), "Has right templates length");

				test.ok(result.one, "has one");
				test.ok(result.two, "has two");

				var fromString = '';
				// Have to use eval to get the template to compile; see https://github.com/twitter/hogan.js/issues/79
				eval('fromString = new Hogan.Template(' + result.one.contents + ', templates.one, Hogan);');
				test.equal(fromString.render(), "This is a valid template.", "Has right template value");
				eval('fromString = new Hogan.Template(' + result.two.contents + ', templates.two, Hogan);');
				test.equal(fromString.render({somevalue: 13}), "This is also a valid template with 13 in it.", "Has right template with variable value");

				test.done();
			});
		}
	}
};

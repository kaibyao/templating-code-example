var fs = require('fs'),
	path = require("path");

var CacheSwap = require('../source/utilities/cacheSwap');

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

var makeSwap = function() {
	return new CacheSwap({
		cacheDirName: "test"
	});
};

module.exports = {
	setUp : function ( callback ) {
		var swap = makeSwap();

		swap._prepCategory("test", function(err) {
			if(err){
				throw err;
			}

			callback();
		});
	},
	tearDown : function ( callback ) {
		// clean up
		var swap = makeSwap();

		swap.clear(null, function(err) {
			if(err) {
				throw err;
			}

			callback();
		});
	},
	cacheSwap : {
		"exists": function(test) {
			test.ok(CacheSwap, "exists");
			test.ok(new CacheSwap(), "instantiates");

			test.done();
		},

		"prepPath": function(test) {
			var swap = makeSwap();

			var filePath = swap.getCachedFilePath("test", "123");
			swap._prepPath(filePath, function(err) {
				if(err){
					test.ok(false, err.message);
					return test.done();
				}
				test.ok(true, "returned");

				fs.exists(path.dirname(filePath), function(exists) {
					test.ok(exists, "file dir exists");
					test.done();
				});
			});
		},

		"clear": function(test) {
			var swap = makeSwap();

			test.ok(swap.clear, "has clear method");

			swap.clear(null, function(err) {
				if(err) {
					test.ok(false, err.message);
					return test.done();
				}

				// TODO: Test that stuff is deleted

				test.done();
			});
		},

		"addCached": function(test) {
			var swap = makeSwap();
			test.ok(swap.addCached, "has addCached");

			swap.addCached("test", "1234", "somecontents", function(err, filePath) {
				if(err){
					test.ok(false, err.message);
					return test.done();
				}

				fs.exists(filePath, function(exists) {
					test.ok(exists, "file exists");

					test.done();
				});
			});
		},

		"getCached": function(test) {

			var swap = makeSwap();

			swap.addCached("test", "1234", "somecontents", function(err, filePath) {
				if(err){
					test.ok(false, err.message);
					return test.done();
				}

				swap.getCached("test", "1234", function(err, cached) {
					if(err) {
						test.ok(false, err.message);
						return test.done();
					}

					test.ok(cached, "returned cached object");

					test.equal(cached.contents, "somecontents", "has contents");

					test.done();
				});
			});
		}
	}
};
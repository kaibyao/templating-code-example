var fs = require('fs'),
	path = require("path"),
	os = require("os");

var _ = require("underscore"),
	async = require("async"),
	rimraf = require("rimraf");

var CacheSwap = function(opts) {
	this.options = _.defaults(opts || {}, {
		tmpDir: os.tmpDir(),
		cacheDirName: "macheteCacheSwap"
	});
};

CacheSwap.prototype = {

	clear: function(category, done) {
		var dir = path.join(this.options.tmpDir, this.options.cacheDirName);

		if(category) {
			dir = path.join(dir, category);
		}

		rimraf(dir, done);
	},
	
	hasCached: function(category, hash, done) {
		var filePath = this.getCachedFilePath(category, hash);
		
		fs.exists(filePath, function(exists) {
			return done(exists, filePath);
		});
	},

	getCached: function(category, hash, done) {
		var self = this;

		this.hasCached(category, hash, function(exists, filePath) {
			if(!exists) {
				return done();
			}

			fs.readFile(filePath, function(err, fileStream) {
				if(err) {
					return done(err);
				}

				done(null, {
					contents: fileStream.toString(),
					path: filePath
				});
			});
		});
	},

	addCached: function(category, hash, contents, done) {
		var filePath = this.getCachedFilePath(category, hash);

		this._prepPath(filePath, function(err) {
			if(err) {
				return done(err);
			}

			fs.writeFile(filePath, contents, function(err) {
				if(err) {
					return done(err);
				}

				done(null, filePath);
			});
		});
	},

	getCachedFilePath: function(category, hash) {
		return path.join(this.options.tmpDir, this.options.cacheDirName, category, hash);
	},

	_prepCategory: function(category, done) {
		var filePath = this.getCachedFilePath(category, "prep");

		this._prepPath(filePath, done);
	},

	_prepPath: function(filePath, done) {
		// TODO: This probably could be optimized a bit, but really, is it worth it?

		var makeDir = function(dir, cb) {

			fs.exists(dir, function(exists) {
				if(exists) {
					// Already created, go ahead and continue
					return cb();
				}

				// Create and continue
				fs.mkdir(dir, parseInt("0700", 8), function(err) {
					// No harm if the error is that the directory already exists
					if(err && err.code !== "EEXIST") {
						return cb(err);
					}

					cb();
				});
			});
		};

		var tmpDir = this.options.tmpDir,
			dirName = path.dirname(filePath),
			partDir = path.relative(tmpDir, dirName),
			prev = "",
			// Get all paths we need to possibly create between temp and file dir.
			toCreate = _.map(partDir.split(path.sep), function(part) {
				var full = path.join(tmpDir, prev, part);

				prev = path.join(prev, part);

				return full;
			});

		// Create each dir
		async.forEachSeries(toCreate, makeDir, function(err) {
			if(err) {
				return done(err);
			}

			done();
		});
	}
};

module.exports = CacheSwap;
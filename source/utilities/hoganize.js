var path = require("path");

var q = require('q'), 
	_ = require('underscore'),
	hogan = require("hogan.js"),
	mustache = require('mustache'),
	async = require("async");

var Files = require("./files"),
	CacheSwap = require("./cacheSwap.js");

var Hoganizer = function() {

};

Hoganizer.prototype = {
	getHoganizedTemplates: function( templates, done ) {
		var self = this,
			origLength = _.size(templates),
			compLength = 0,
			hoganized = {},
			files = new Files(),
			swap = new CacheSwap({
				tmpDir: process.cwd(),
				cacheDirName: ".hoganizeSwap"
			}),
			addToHoganized = function(yeahbrotha, templatePath) {
				hoganized[templatePath] = {
					contents: yeahbrotha
				};
				
				var stringed = JSON.stringify( yeahbrotha );
				if(!stringed) {
					throw new Error("Parse error");
				} else if(stringed.length < 1) {
					throw new Error("Template empty " + templatePath);
				}

				hoganized[templatePath].version = files.shaIt( stringed );
			},
			processTemplate = function(template, done) {
				var templateStr = template.content,
					templatePath = template.path,
					templateHash = files.shaIt(templateStr);

				swap.getCached("hoganize", templateHash, function(err, cached) {
					if(err) {
						return done(err);
					}

					var yeahbrotha,
						stringed;

					if(cached) {
						yeahbrotha = cached.contents;
						try {
							addToHoganized(yeahbrotha, templatePath);
						} catch(e){
							return done(e);
						}

						done();
					} else {
						yeahbrotha = self._compileTemplate(templateStr, templatePath);
						// Add the compiled template to the cache swap for next time.
						swap.addCached("hoganize", templateHash, yeahbrotha, function(err) {
							if(err) {
								return done(err);
							}

							try {
								addToHoganized(yeahbrotha, templatePath);
							} catch(e) {
								return done(e);
							}

							done();
						});
					}

				});
			};
		
		// Build up a single array of work items for async.each
		var templateArray = [];
		_.each(templates, function(templateStr, templatePath) {
			templateArray.push({content: templateStr, path: templatePath});
		});

		async.forEach(templateArray, processTemplate, function(err, results) {
			if (err) {
				// TODO: Wrap...?
				return done(err);
			}

			compLength = _.size(hoganized);
			if(compLength !== origLength) {
				console.log('Hoganized did not work on all files. [' + compLength + ' of ' + origLength + "]");
				return done(new Error("Hoganized failed [" + compLength + ' of ' + origLength + "]"));
			}

			done(null, hoganized);
		});
	},

	_compileTemplate: function(templateStr, templatePath) {
		try {
			var sanityCheck = mustache.render( templateStr ); // hogan likes to inifinite loop, this just uses mustach to make sure we're good.
		} catch(e) {
			if(e.type !== "non_object_property_load") { // no data passed in, looking for parse error
				var error = 'Template failed to validate [' + templatePath + '] ' + e +"\n\nTemplate:\n"+ templateStr;
				throw new Error(error);
			}
		}

		var yeahbrotha = hogan.compile( templateStr, { asString : true } );
			
		if(!yeahbrotha || yeahbrotha.length < 1) {
			console.log("Stupid " + templateStr);
		}

		return yeahbrotha;
	}
};

module.exports = Hoganizer;

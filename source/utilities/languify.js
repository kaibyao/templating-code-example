var mustache = require('mustache'),
	_ = require('underscore');

var Languifier = function() {

};

Languifier.prototype.languifyTemplates = function( data, templates ) {
	var oldTags = mustache.tags,
		returnTemplates = {},
		origLength = _.size(templates);

	mustache.tags = [ '[[', ']]' ];
	
	_.each(templates, function(templateVal, templateName) {
		if(!templateVal) {
			console.log('Template does not exist or is blank: ' + templateName);
			return;
		}
		
		var mustached = mustache.render( templateVal, { lang : data.grammar } );

		// simple compression
		mustached = mustached.replace(/\t/g,'').replace(/\n/g,'').replace(/ +(?= )/g,'');
		
		returnTemplates[templateName] = mustached;

		if(!returnTemplates[templateName] || returnTemplates[templateName].length < 1) {
			console.log('Error in ' + templateName + '\n\n' + templateVal);
		}
	});

	if(origLength !== _.size(returnTemplates)) {
		console.log('Tmpl language may have failed; return size does not match. [' + _.size(returnTemplates) + ' of ' + origLength + ']');
	}

	mustache.tags = oldTags;
	
	return returnTemplates;
};

module.exports = Languifier;
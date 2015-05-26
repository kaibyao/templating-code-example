var Files = require( '../source/utilities/files' ),
	q = require( 'q' );
	

module.exports = {
	setUp : function ( callback ) {
		callback();
	},
	tearDown : function ( callback ) {
		// clean up
		callback();
	},
	files : {
		'getTemplatePath' : function ( test ) {
			var config = { paths : { templates : '' } },
				files = new Files(config);

			test.expect( 2 );

			test.equal( files.getTemplatePath( 'test' ), '/test', 'sets path version correctly.' );
			test.equal( files.getTemplatePath( '' ), '/default', 'sets default path when version not supplied.' );

			test.done();
		},
		'getTemplates' : function ( test ) {
			var data = { templates : [ 'test/template' ] },
				files = new Files();

			files.getTemplatePath = function() { return ''; };
			files.onFileRead = function() {};
			files._readFile = function() { test.ok( true, 'reads file when template names provided.' ); };
			
			test.expect( 2 );

			files.getTemplates( data, {}, {} );

			data = {};
			files.getTemplates( data, {}, {} ).fail( function() {
				test.ok( true, 'errors out when invalid data provided.' );
				test.done();
			} );
		},
		'onFileRead' : function ( test ) {
			var files = new Files(),
				defer = q.defer(),
				templates = {},
				response = {},
				numTemplates = 2,
				numLoaded = [];

			test.expect( 3 );

			defer.promise.fail( function() { test.ok( true, 'errors out when file read is incomplete.' ); test.done(); } );
			files.onFileRead( templates, response, defer, numTemplates, 'test/template_1', numLoaded )( 'error', null );

			defer = q.defer();
			defer.promise.then( function() { test.equal( numLoaded.length, numTemplates, 'when all templates are loaded/stored in object, resolve promise.' ); } );

			files.onFileRead( templates, response, defer, numTemplates, 'test/template_1', numLoaded )( null, 'template string 1' );
			test.equal( numLoaded.length, 1, 'increments # of loaded templates when file is read.' );
			test.equal( templates[ 'test/template_1' ], 'template string 1', 'loads template strings correctly into templates object.' );

			files.onFileRead( templates, response, defer, numTemplates, 'test/template_2', numLoaded )( null, 'template string 2' );
		}
	}
};

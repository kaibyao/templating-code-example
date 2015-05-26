/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    meta: {
      version: '0.2.0',
      banner: '/*! \/machete\/ - v<%= meta.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '* http://bitbucket.org/sproutsocial/machete/\n' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> ' +
        'Andrew Wilson, Kai Yao, Jacob Gable; */'
    },
    nodeunit: {
      all: ['tests/**/*.js']
    },
    watch: {
      files: ['gruntFile.js', 'source/**/*.js', 'tests/**/*.js'],
      tasks: ['jshint:dev', 'nodeunit:all']
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        strict: false,
        node: true,
        expr: true
      },
      dev: ['gruntFile.js', 'source/**/*.js', 'tests/**/*.js']
    }
  });

  // Npm Tasks
  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-contrib-nodeunit");
  grunt.loadNpmTasks("grunt-contrib-watch");

  // Default task.
  grunt.registerTask('default', ['jshint', 'nodeunit:all']);
  
};

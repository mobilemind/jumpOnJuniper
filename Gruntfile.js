/* global module:false */
module.exports = function(grunt) {
  "use strict";

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: ['web/', 'validation-status.json'],
    jshint: {
      files: ['Gruntfile.js'],
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        noempty: true,
        strict: true,
        sub: true,
        trailing: true,
        undef: true,
        unused:true,
        lastsemic: true,
        node: true
      }
    },
    'string-replace': {
        main: { src: ['src/joj.html'], dest: 'web/joj.html' },
        manifest: { src: ['src/joj.manifest'], dest: 'web/joj.manifest' },
        dataurl: { src: ['src/joj.url.html'], dest: 'web/joj.url.html' },
        options: {
          replacements: [
            { pattern: /_MmVERSION_/g, replacement: '<%= pkg.version %>' },
            { pattern: /_MmBUILDDATE_/g, replacement: '<%= grunt.template.today() %>' }
          ]
        }
    },
    html_minify: {
      main: { src: ['web/joj.html'], dest: 'web/joj.html' },
      dataurl: { src: ['web/joj.url.html'], dest: 'web/joj.url.html' },
      options: {}
    },
    validation: {
      sources: ['src/joj*.html'],
      web:  ['web/joj*.html'],
      options: {
        doctype: "HTML5",
        charset: "utf-8",
        relaxerror: ["Bad value cleartype for attribute http-equiv on element meta.",
          "Attribute autoc[a-z]+ not allowed on element input at this point."],
        reportpath: false
      }
    }
  });

  // Load plugins
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-html-validation');
  grunt.loadNpmTasks('grunt-html-minify');
  grunt.loadNpmTasks('grunt-string-replace');

  grunt.log.writeln('\n' + grunt.config('pkg.name') + ' ' + grunt.config('pkg.version'));

  // replace tokens task
  grunt.registerTask('tokenswap', 'replace tokens', function() {
    grunt.task.run(['string-replace:main', 'string-replace:manifest', 'string-replace:dataurl']);
  });

  // reduce HTML task
  grunt.registerTask('reducehtml', 'reduce html', function() {
    grunt.task.run(['html_minify:main', 'html_minify:dataurl']);
  });

  // test task
  grunt.registerTask('test', ['jshint:files', 'tokenswap', 'reducehtml', 'validation:web' ]);

  // Default task
  grunt.registerTask('default', ['clean', 'jshint:files', 'tokenswap', 'reducehtml', 'validation:web' ]);

};

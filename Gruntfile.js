/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      files: ['Gruntfile.js'],
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
        jquery: true,
        browser: true
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
  grunt.loadNpmTasks('grunt-string-replace');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-html-validation');
  grunt.loadNpmTasks('grunt-html-minify');

  // replace tokens task
  grunt.registerTask('tokenswap', 'replace tokens', function() {
    grunt.task.run(['string-replace:main', 'string-replace:manifest', 'string-replace:dataurl']);
  });

  // reduce HTML task
  grunt.registerTask('reducehtml', 'reduce html', function() {
    grunt.task.run(['html_minify:main', 'html_minify:dataurl']);
  });

  // Default task
  grunt.registerTask('default', ['jshint:files', 'tokenswap', 'reducehtml', 'validation:web' ]);

};

/* global module:false */
module.exports = function(grunt) {
  "use strict";

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: {
      files: ['web/', 'validation-status.json'],
      build: ['web/joj.html', 'web/joj.url.html']
    },
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
    qunit: {
      all: ['tests/**/*.html']
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
    },
    zopfli: {
      main: { src: ['web/joj.html'], dest: 'web/joj' },
      dataurl: { src: ['web/joj.url.html'], dest: 'web/joj.url' },
      options: {
        verbose: false,
        verbose_more: false,
        numiterations: 1000,
        blocksplitting: true,
        blocksplittinglast: false,
        blocksplittingmax: 15
      }
    },
    text2datauri:  {
      'web/joj.url': 'web/joj.url.html',
      options: {
        sourceCharset: 'utf-8', // 'utf-8' or 'ascii'; actual format not validated (yet?)
        protocol: 'data:', // any string; this is not validated by text2datauri
        mimeType: 'text/html', // any string;  this is not validated by text2datauri
        targetCharset: 'utf-8', // 'utf-8' or ''; metadata only- output is always utf-8
        encoding: 'base64' // 'base64' or 'uri'; use 'uri' for encodeURIComponent() encoding
      }
    },
    rename: {
      main: {
        files: [ {src: ['web/joj.gz'], dest: 'web/joj'} ]
      }
    }
  });

  // Load plugins
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-rename');
  grunt.loadNpmTasks('grunt-contrib-zopfli');
  grunt.loadNpmTasks('grunt-html-minify');
  grunt.loadNpmTasks('grunt-html-validation');
  grunt.loadNpmTasks('grunt-string-replace');
  grunt.loadNpmTasks('text2datauri');

  grunt.log.writeln('\n' + grunt.config('pkg.name') + ' ' + grunt.config('pkg.version'));

  // replace tokens task
  grunt.registerTask('tokenswap', 'replace tokens', function() {
    grunt.task.run(['string-replace:main', 'string-replace:manifest', 'string-replace:dataurl']);
  });

  // reduce HTML task
  grunt.registerTask('reducehtml', 'reduce html', function() {
    grunt.task.run(['html_minify:main', 'html_minify:dataurl']);
  });

  // maximum gzip
  grunt.registerTask('gziphtml', 'gzip html', function() {
    grunt.task.run(['zopfli:main']);
  });

  // test task
  grunt.registerTask('test', ['jshint:files', 'tokenswap', 'reducehtml', 'qunit', 'validation:web' ]);

  // Default task
  grunt.registerTask('default', ['clean:files',
    'jshint:files', 'tokenswap', 'reducehtml', 'validation:web',
    'gziphtml', 'text2datauri', 'rename:main', 'clean:build']);

};

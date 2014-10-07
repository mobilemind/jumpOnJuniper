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
        unused: false,
        lastsemic: true,
        node: true
      }
    },
    copy: {
      options: {
        nonull: true,
        noprocess: '**/*.png',
        process: function (content, srcpath) {
          content = content.replace(/_MmVERSION_/g, grunt.config('pkg.version'));
          return content.replace(/_MmBUILDDATE_/g, grunt.template.today());
        }
      },
      main: { files: [ {expand: true, cwd: 'src/', src: ['**'], dest: 'web/'} ]}
    },
    html_minify: {
      main: { src: ['web/joj.html'], dest: 'web/joj.html' },
      dataurl: { src: ['web/joj.url.html'], dest: 'web/joj.url.html' },
      options: {}
    },
    minifyHtml: {
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
          "Attribute autoc[a-z]+ not allowed on element input at this point.",
          "Bad value robots for attribute name on element meta: Keyword robots is not registered."],
        reportpath: false
      }
    },
    zopfli: {
      main: { src: ['web/joj.html'], dest: 'web/joj' },
      options: {
        verbose: false,
        verbose_more: false,
        numiterations: 110,
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
    },
  'sftp-deploy': {
    main: {
      auth: {
        host: process.env.MYSERVER,
        port: 22,
        authKey: 'privateKeyCustom'
      },
      src: 'web',
      dest: process.env.MYSERVERHOME + '/me',
      exclusions: ['web/**/.DS_Store', 'web/img/**'],
      serverSep: '/'
    }
}
  });

  // Load plugins
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-rename');
  grunt.loadNpmTasks('grunt-contrib-zopfli');
  grunt.loadNpmTasks('grunt-html-minify');
  grunt.loadNpmTasks('grunt-minify-html');
  grunt.loadNpmTasks('grunt-html-validation');
  grunt.loadNpmTasks('grunt-sftp-deploy');
  grunt.loadNpmTasks('text2datauri');

  grunt.log.writeln('\n' + grunt.config('pkg.name') + ' ' + grunt.config('pkg.version'));

  // test task
  // Default task
  grunt.registerTask('test', ['jshint', 'copy',
    'html_minify:main', 'html_minify:dataurl', 'minifyHtml:main', 'minifyHtml:dataurl',
    'validation:web','zopfli', 'text2datauri', 'rename:main']);

  // Default task
  grunt.registerTask('default', ['clean', 'test', 'clean:build']);

  // deploy task
  grunt.registerTask('deploy', ['default', 'sftp-deploy']);

};

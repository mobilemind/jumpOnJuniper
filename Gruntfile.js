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
    "string-replace": {
        main: {
          src: ['src/joj.html'],
          dest: 'web/joj.html'
        },
        manifest: {
          src: ['src/joj.manifest'],
          dest: 'web/joj.manifest'
        },
        dataurl: {
          src: ['src/joj.url.html'],
          dest: 'web/joj.url.html'
        },
        options: {
          replacements: [{
            pattern: /_MmVERSION_/g,
            replacement: '<%= pkg.version %>'
            }, {
            pattern: /_MmBUILDDATE_/g,
            replacement: '<%= grunt.template.today() %>'
            }
          ]
        }
    },
    html_minify: {
      main: {
        src: ['web/joj.html'],
        dest: 'web/joj.html'
      },
      dataurl: {
        src: ['web/joj.url.html'],
        dest: 'web/joj.url.html'
      },
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

  // Load "grunt-string-replace"
  grunt.loadNpmTasks('grunt-string-replace');

  // Load "jshint" plugin
  grunt.loadNpmTasks('grunt-contrib-jshint');

  // Load "validation" HTML validation plugin
  grunt.loadNpmTasks('grunt-html-validation');

  // Load "html-minify" plugin
  grunt.loadNpmTasks('grunt-html-minify');

  // replace tokens task
  grunt.registerTask('tokenswap', ['string-replace:main', 'string-replace:manifest', 'string-replace:data' ]);

  // test
  // grunt.registerTask('test',  ['jshint', 'string-replace', 'validation']);

  // Load local tasks
  // grunt.loadTasks('tasks');

  // Default task
  grunt.registerTask('default', ['jshint:files', 'string-replace:main', 'string-replace:manifest', 'string-replace:dataurl', 'html_minify:main', 'html_minify:dataurl', 'validation:web' ]);

};

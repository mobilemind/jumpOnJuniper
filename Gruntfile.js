/* global module:false */
module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: {
      files: ['web/'],
      build: ['web/joj.html', 'web/*.deflate', 'web/*.gz']
    },
    csslint: {
    	files: ['src/joj.css'],
    	options: {
    		"box-model": false
    	}
    },
    cssmin: {
    	target: {
    		files: { 'web/joj.css': ['src/joj.css'] }
    	},
      options: {
        debug: false,
        keepSpecialComments: 0,
        rebase: false,
        report: 'min'
      }
    },
    jshint: {
      files: ['Gruntfile.js', 'src/*.js'],
      options: {
        jshintrc: '.jshintrc'
      }
    },
    uglify: {
      options: {
        stats: true,
        maxLineLen: 32766,
        preserveComments: false,
        screwIE8: true,
        quoteStyle: 1,
        mangle: {
          sort: true,
          toplevel: true
        },
        compress: {
          sequences: true,
          properties: true,
          dead_code: false,
          drop_console: false,
          drop_debugger: true,
          unsafe: true,
          conditionals: true,
          comparisons: true,
          evaluate: true,
          booleans: true,
          loops: true,
          unused: true,
          hoist_funs: false,
          hoist_vars: false,
          if_return: true,
          join_vars: true,
          cascade: true,
          collapse_vars: true,
          warnings: true,
          negate_iife: true,
          keep_fargs: false,
          side_effects: true,
          global_defs: {}
        },
        codegen: {
          beautify: false,
          indent_level: 0,
          quote_keys: false,
          space_colon: false,
          max_line_len: 32766,
          ie_proof: false,
          bracketize: false,
          comments: false,
          semicolons: true,
          quote_style: 1
        },
        report: 'min'
      },
      target: { files: [{
        expand: true,
        cwd: 'web',
        src: '*.js',
        dest: 'web'
      }]}
    },
    copy: {
      options: {
        nonull: true,
        noprocess: '**/*.png',
        process: function (content, srcpath) {
          content = content.replace(/_MmVERSION_/g, grunt.config('pkg.version'));
          return content.replace(/_MmBUILDDATE_/g, grunt.template.date(new Date(), "ddd mmm dd yyyy h:MM TT"));
        }
      },
      main: { files: [ {expand: true, cwd: 'src/', src: ['**'], dest: 'web/'} ]}
    },
    html_minify: {
      target: { files: [
      	{ src: ['web/joj.html'], dest: 'web/joj.html' },
      	{ src: ['web/joj.url.html'], dest: 'web/joj.url.html' },
      	{ src: ['web/joj.url.template.html'], dest: 'web/joj.url.template.html' } ]
      },
      options: {}
    },
    minifyHtml: {
      target: { files: [
      	{ src: ['web/joj.html'], dest: 'web/joj.html' },
      	{ src: ['web/joj.url.html'], dest: 'web/joj.url.html' },
      	{ src: ['web/joj.url.template.html'], dest: 'web/joj.url.template.html' } ]
      },
      options: {}
    },
    zopfli: {
      target: { files: [
        { src: ['web/joj.html'], dest: 'web/joj.deflate' },
        { src: ['web/joj.js'], dest: 'web/joj.js.deflate' },
        { src: ['web/joj.css'], dest: 'web/joj.css.deflate' } ]
      },
      options: {
        mode: 'deflate',
        verbose: false,
        verbose_more: false,
        numiterations: 96,
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
        files: [
        	{src: ['web/joj.deflate'], dest: 'web/joj'},
        	{src: ['web/joj.css.deflate'], dest: 'web/joj.css'},
       		{src: ['web/joj.js.deflate'], dest: 'web/joj.js'} ]
      },
      options: {
      	force: true
      }
    },
		yamllint: {
			files: { src: [ '*.yaml' ] }
    }
  });

  // Load plugins
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-csslint');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-rename');
  grunt.loadNpmTasks('grunt-zopfli-native');
  grunt.loadNpmTasks('grunt-html-minify');
  grunt.loadNpmTasks('grunt-minify-html');
  grunt.loadNpmTasks('text2datauri');
	grunt.loadNpmTasks('grunt-yamllint');

  grunt.log.writeln('\n' + grunt.config('pkg.name') + ' ' + grunt.config('pkg.version'));

  // build wrapper for joj.html
  grunt.registerTask('jojurlfinalhtml', 'make HTML that pretty-prints joj.url', function() {
    // read final bookmarklet and HTML wrapper template
    var jojurlStr = grunt.file.read('web/joj.url');
    if (!jojurlStr || 0 === jojurlStr.length) grunt.fail.fatal("Can't read from web/joj.url");
    var jojurltemplateStr = grunt.file.read('web/joj.url.template.html');
    if (!jojurltemplateStr || 0 === jojurltemplateStr.length) grunt.fail.fatal("Can't read from web/joj.url.template.html");
    // do replacement
    jojurltemplateStr = jojurltemplateStr.replace('_MmJOJURL_', jojurlStr);
    if (grunt.file.write('web/joj.url.html', jojurltemplateStr)) {
      grunt.log.writeln('web/joj.url.html updated to ' + grunt.config('pkg.version'));
      return grunt.file.delete('web/joj.url.template.html');
    }
    else grunt.fail.fatal("Can't write to web/joj.url.html.");
  });

  // test task
  grunt.registerTask('test', ['jshint', 'csslint', 'copy', 'cssmin', 'uglify',
    'html_minify', 'minifyHtml', 'zopfli', 'text2datauri', 'rename', 'yamllint']);

  // Default task
  grunt.registerTask('default', ['clean', 'test', 'clean:build', 'jojurlfinalhtml']);

};

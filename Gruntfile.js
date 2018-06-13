/* global module:false */
module.exports = function (grunt) {
    // Project configuration
    grunt.initConfig({
        "clean": {
            "build": ["web/joj.html", "web/*.deflate", "web/*.gz"],
            "files": ["web/"]
        },
        "copy": {
            "main": {
                "files": [{
                    "cwd": "src/",
                    "dest": "web/",
                    "expand": true,
                    "src": ["**"]
                }]
            },
            "options": {
                "nonull": true,
                "noprocess": "**/*.png",
                process (content, srcpath) {
                    const result = content.replace(/_MmVERSION_/g, grunt.config("pkg.version"));
                    return result.replace(/_MmBUILDDATE_/g, grunt.template.date(new Date(), "ddd mmm dd yyyy h:MM TT"));
                }
            }
        },
        "csslint": {
            "files": ["src/joj.css"],
            "options": {"box-model": false}
        },
        "cssmin": {
            "options": {
                "debug": false,
                "keepSpecialComments": 0,
                "rebase": false,
                "report": "min"
            },
            "target": {"files": {"web/joj.css": ["src/joj.css"]}}
        },
        "eslint": {
            "options": {"configFile": ".eslintrc.yml"},
            "target": ["Gruntfile.js", "src/*.js"]
        },
        "html_minify": {
            "options": {},
            "target": {
                "files": [
                    {
                        "dest": "web/joj.html",
                        "src": ["web/joj.html"]
                    },
                    {
                        "dest": "web/joj.url.html",
                        "src": ["web/joj.url.html"]
                    },
                    {
                        "dest": "web/joj.url.template.html",
                        "src": ["web/joj.url.template.html"]

                    }
                ]
            }
        },
        "minifyHtml": {
            "options": {},
            "target": {
                "files": [
                    {
                        "dest": "web/joj.html",
                        "src": ["web/joj.html"]
                    },
                    {
                        "dest": "web/joj.url.html",
                        "src": ["web/joj.url.html"]
                    },
                    {
                        "dest": "web/joj.url.template.html",
                        "src": ["web/joj.url.template.html"]
                    }
                ]
            }
        },
        "pkg": grunt.file.readJSON("package.json"),
        "rename": {
            "main": {
                "files": [
                    {
                        "dest": "web/joj",
                        "src": ["web/joj.deflate"]
                    },
                    {
                        "dest": "web/joj.css",
                        "src": ["web/joj.css.deflate"]
                    },
                    {
                        "dest": "web/joj.js",
                        "src": ["web/joj.js.deflate"]
                    }
                ]
            },
            "options": {"force": true}
        },
        "text2datauri": {
            "options": {
                "encoding": "base64", // 'base64' or 'uri'; use 'uri' for encodeURIComponent() encoding
                "mimeType": "text/html", // any string;  this is not validated by text2datauri
                "protocol": "data:", // any string; this is not validated by text2datauri
                "sourceCharset": "utf-8", // 'utf-8' or 'ascii'; actual format not validated (yet?)
                "targetCharset": "utf-8" // 'utf-8' or ''; metadata only- output is always utf-8
            },
            "web/joj.url": "web/joj.url.html"
        },
        "uglify": {
            "options": {
                "beautify": false,
                "compress": {
                    "drop_console": true,
                    "expression": true,
                    "keep_fargs": false,
                    "passes": 2,
                    "pure_getters": true,
                    "side_effects": false,
                    "toplevel": true,
                    "unsafe": true,
                    "unsafe_comps": true,
                    "unsafe_math": true,
                    "unsafe_proto": true
                },
                "es": 6,
                "ie8": false,
                "mangle": {"toplevel": true},
                "maxLineLen": 32766,
                "output": {
                    "ascii_only": true,
                    "bracketize": false,
                    "comments": false,
                    "indent_level": 0,
                    "max_line_len": 32766,
                    "quote_keys": false,
                    "quote_style": 1,
                    "semicolons": true
                },
                "preserveComments": false,
                "properties": false,
                "quoteStyle": 1,
                "report": "min",
                "stats": true,
                "wrap": false
            },
            "target": {
                "files": [{
                    "cwd": "web",
                    "dest": "web",
                    "expand": true,
                    "src": "*.js"
                }]
            }
        },
        "yamllint": {
            "files": {"src": [".*.yml", "*.yml", "*.yaml"]},
            "options": {"schema": "FAILSAFE_SCHEMA"}
        },
        "zopfli": {
            "options": {
                "format": "deflate",
                "iterations": 96,
                "report": true
            },
            "target": {
                "files": [
                    {
                        "dest": "web/joj.deflate",
                        "src": ["web/joj.html"]
                    },
                    {
                        "dest": "web/joj.js.deflate",
                        "src": ["web/joj.js"]
                    },
                    {
                        "dest": "web/joj.css.deflate",
                        "src": ["web/joj.css"]
                    }
                ]
            }
        }
    });

    // Load plugins
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-contrib-csslint");
    grunt.loadNpmTasks("grunt-contrib-cssmin");
    grunt.loadNpmTasks("grunt-contrib-uglify-es");
    grunt.loadNpmTasks("grunt-contrib-rename");
    grunt.loadNpmTasks("grunt-eslint");
    grunt.loadNpmTasks("grunt-html-minify");
    grunt.loadNpmTasks("grunt-minify-html");
    grunt.loadNpmTasks("grunt-yamllint");
    grunt.loadNpmTasks("grunt-zopfli");
    grunt.loadNpmTasks("text2datauri");

    grunt.log.writeln(`\n${grunt.config("pkg.name")} ${grunt.config("pkg.version")}`);

    // build wrapper for joj.html
    grunt.registerTask("jojurlfinalhtml", "make HTML that pretty-prints joj.url", function () {
        // read final bookmarklet and HTML wrapper template
        const jojurlStr = grunt.file.read("web/joj.url");
        if (!jojurlStr || 0 === jojurlStr.length) grunt.fail.fatal("Can't read from web/joj.url");
        let jojurltemplateStr = grunt.file.read("web/joj.url.template.html");
        if (!jojurltemplateStr || 0 === jojurltemplateStr.length) grunt.fail.fatal("Can't read from web/joj.url.template.html");
        // do replacement
        jojurltemplateStr = jojurltemplateStr.replace("_MmJOJURL_", jojurlStr);
        if (grunt.file.write("web/joj.url.html", jojurltemplateStr)) {
            grunt.log.writeln(`web/joj.url.html updated to ${grunt.config("pkg.version")}`);
            return grunt.file.delete("web/joj.url.template.html");
        }
        grunt.fail.fatal("Can't write to web/joj.url.html.");
        return false;
    });

    // test task
    grunt.registerTask("test", ["yamllint", "eslint", "csslint", "copy",
        "cssmin", "uglify", "html_minify", "minifyHtml", "zopfli",
        "text2datauri", "rename"]);

    // Default task
    grunt.registerTask("default", ["clean", "test", "clean:build", "jojurlfinalhtml"]);

};

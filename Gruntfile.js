module.exports = function (grunt) {
    var appHtml = grunt.file.read("assets/html/app.html");

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        uglify: {
            dev: {
                options: {
                    compress: false,
                    beautify: true,
                    mangle: false
                },
                files: {
                    "assets/js/service-map.min.js": "assets/js/service-map.js"
                }
            },
            prod: {
                files: {
                    "assets/js/service-map.min.js": "assets/js/service-map.js"
                }
            }
        },

        cssmin: {
            prod: {
                files: {
                    "assets/css/services.min.css": "assets/css/services.css"
                }
            }
        },

        copy: {
            dev: {
                files: {
                    "assets/css/services.min.css": "assets/css/services.css"
                }
            },
            build: {
                src: ["./**", "!./build/**", "!./node_modules/**"],
                dest: "build/"
            },
            ingeniux: {
                files: [
                    {
                        expand: true,
                        flatten: true,
                        src: ["assets/html/app.html", "assets/js/service-map.min.js", "assets/css/services.min.css", "data/services.json"],
                        dest: "ingeniux/"
                    }
                ]
            }
        },

        clean: {
            build: {
                options: {
                    force: true
                },
                src: "build"
            }
        },
        
        replace: {
            build: {
                src: ["assets/html/layout.html"],
                dest: ["index.html"],
                replacements: [
                    {
                        from: "<!-- render app.html here DO NOT DELETE THIS LINE! -->",
                        to: appHtml
                    }
                ]
            },
            ingeniux: {
                src: ["ingeniux/service-map.min.js"],
                dest: ["ingeniux/service-map.min.js"],
                replacements: [
                    {
                        from: "data/services.json",
                        to: "documents/service-map/services.json"
                    }
                ]
            }
        },
        
        file_append: {
            ingeniux: {
                files: {
                    "ingeniux/app.html": {
                        append: "<script src='prebuilt/stylenew/js/libs/angular.min.js'></script><script src='documents/service-map/service-map.min.js'></script><link rel='stylesheet' href='documents/service-map/services.min.css' />",
                        input: "ingeniux/app.html"
                    }
                }
            }  
        },

        connect: {
            server: {
                options: {
                    port: 5100,
                    base: '.',
                    livereload: true
                }
            },
            keep: {
                options: {
                    port: 5100,
                    base: ".",
                    keepalive: true
                }
            }
        },

        git_deploy: {
            prod: {
                options: {
                    url: "https://github.com/BYUI-Web/service-map.git"
                },
                src: "build"
            }
        },

        watch: {
            js: {
                files: ['./assets/js/*.js', './assets/js/*.json', "!./assets/js/*.min.js"],
                options: {
                    livereload: true
                },
                tasks: ["uglify:dev"]
            },
            css: {
                files: ["./assets/css/*.css", "!./assets/css/*.min.css"],
                options: {
                    livereload: true
                },
                tasks: ["copy:dev"]
            },
            html: {
                files: ["**/*.html"],
                options: {
                    livereload: true
                }
            }
        },
    });

    require("load-grunt-tasks")(grunt);

    grunt.registerTask("default", ["uglify:prod", "cssmin:prod", "replace:build", "ingeniux"]);
    grunt.registerTask('dev', ['connect:server', "uglify:dev", "replace:build", "copy:dev", 'watch']);
    grunt.registerTask("prod-test", ["default", "connect:keep"]);
    grunt.registerTask("ingeniux", ["copy:ingeniux", "file_append:ingeniux", "replace:ingeniux"]);
    grunt.registerTask("gh-pages", ["default", "copy:build", "git_deploy", "clean:build"]);

};
module.exports = function (grunt) {

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
                src: "*"
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

    grunt.registerTask("default", ["uglify:prod", "cssmin:prod"]);
    grunt.registerTask('dev', ['connect:server', "uglify:dev", "copy:dev", 'watch']);
    grunt.registerTask("prod-test", ["uglify:prod", "cssmin:prod", "connect:keep"]);
    grunt.registerTask("gh-pages", ["copy:build", "git_deploy", "clean:build"]);

};
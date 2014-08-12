module.exports = function(grunt) {

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    connect: {
      server: {
        options: {
          port: 5100,
          base: '.',
          livereload: true
        }
      }
    },

    watch: {
      another: {
        files: ['*', './assets/js/*.js', './assets/js/*.json'],
        options: {
          livereload: true
        }
      }
    },
  });

  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['connect', 'watch']);

};
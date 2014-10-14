module.exports = function (grunt) {

  grunt.initConfig({
  
    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      files: [
        'Gruntfile.js',
        'index.js',
        'build/build.js',
        'test/**/*.js'
      ],
      options: {
        ignores: [
          'test/bundle.js'
        ]
      }
    },

    shell: {
      tape: {
        command: './node_modules/.bin/tape test/test-psl.js',
        options: { stdout: true, stderr: true }
      },
      data: {
        command: 'node ./data/build.js',
        options: { stdout: true, stderr: true }
      }
    },

    browserify: {
      dist: {
        src: [ 'index.js' ],
        dest: 'dist/<%= pkg.name %>.js',
        options: {}
      }
    },

    uglify: {
      dist: {
        src: [ 'dist/<%= pkg.name %>.js'],
        dest: 'dist/<%= pkg.name %>.min.js'
      }
    },

    compress: {
      main: {
        options: {
          mode: 'gzip'
        },
        files: [
          {
            expand: true,
            cwd: 'dist/',
            src: [ '<%= pkg.name %>.min.js' ],
            dest: 'dist/',
            ext: '.min.js.gz'
          }
        ]
      }
    },

    watch: {
      js: {
        files: [ '<%= jshint.files %>' ],
        tasks: [ 'default' ]
      },
      data: {
        files: [ 'data/build.js', 'data/effective_tld_names.dat' ],
        tasks: [ 'shell:data' ]
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-shell');

  grunt.registerTask('default', [ 'test' ]);
  grunt.registerTask('test', [ 'jshint', 'shell:tape' ]);
  grunt.registerTask('build', [ 'shell:data', 'browserify', 'uglify', 'compress' ]);

};

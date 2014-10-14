var bin = {
  browserify: './node_modules/grunt-browserify/node_modules/browserify/bin/cmd.js',
  zuul: './node_modules/.bin/zuul',
  coverify: './node_modules/.bin/coverify',
  derequire: './node_modules/.bin/derequire'
};

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
      'test-node': {
        command: bin.browserify + ' -t coverify test/test-psl.js --bare | node | ' + bin.coverify,
        options: { stdout: true, stderr: true }
      },
      'test-browser': {
        command: bin.zuul + ' --phantom --ui tape -- ./test/test-psl.js',
        options: { stdout: true, stderr: true }
      },
      data: {
        command: 'node ./data/build.js',
        options: { stdout: true, stderr: true }
      },
      derequire: {
        command: bin.derequire + ' dist/psl.js > dist/psl.amd.js',
        options: { stdout: true, stderr: true }
      }
    },

    browserify: {
      dist: {
        src: [ 'index.js' ],
        dest: 'dist/<%= pkg.name %>.js',
        options: {
          browserifyOptions: {
            standalone: 'psl'
          }
        }
      },
      test: {
        src: [ 'test/test-psl.js' ],
        dest: 'test/bundle.js',
        options: {
          browserifyOptions: {
            debug: true
          }
        }
      }
    },

    uglify: {
      umd: {
        src: [ 'dist/<%= pkg.name %>.js' ],
        dest: 'dist/<%= pkg.name %>.min.js'
      },
      amd: {
        src: [ 'dist/<%= pkg.name %>.amd.js' ],
        dest: 'dist/<%= pkg.name %>.amd.min.js'
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

    clean: {
      data: [ 'data/rules.json' ],
      dist: [ 'dist' ],
      test: [ 'test/bundle.js' ]
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
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-shell');

  grunt.registerTask('default', [ 'build', 'test' ]);
  grunt.registerTask('test', [ 'jshint', 'shell:test-node', 'shell:test-browser' ]);
  grunt.registerTask('build', [
    'clean',
    'shell:data',
    'browserify',
    'shell:derequire',
    'uglify',
    'compress'
  ]);

};

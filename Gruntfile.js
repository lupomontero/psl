var bin = {
  browserify: './node_modules/grunt-browserify/node_modules/browserify/bin/cmd.js',
  zuul: './node_modules/.bin/zuul',
  coverify: './node_modules/.bin/coverify',
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
      ]
    },

    shell: {
      'test-local': {
        command: bin.zuul + ' --local --ui tape -- ./test/test-psl.js',
        options: { stdout: true, stderr: true }
      },
      'test-node': {
        command: bin.browserify + ' -t coverify test/test-psl.js --bare | node | ' + bin.coverify,
        options: { stdout: true, stderr: true }
      },
      'test-phantom': {
        command: bin.zuul + ' --phantom --ui tape -- ./test/test-psl.js',
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
        options: {
          browserifyOptions: {
            standalone: 'psl'
          }
        }
      }
    },

    uglify: {
      umd: {
        src: [ 'dist/<%= pkg.name %>.js' ],
        dest: 'dist/<%= pkg.name %>.min.js'
      }
    },

    clean: {
      data: [ 'data/rules.json' ],
      dist: [ 'dist' ],
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
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-shell');

  grunt.registerTask('default', [ 'build', 'test' ]);

  grunt.registerTask('test', [ 'jshint', 'test-node', 'test-phantom' ]);
  grunt.registerTask('test-node', [ 'shell:test-node' ]);
  grunt.registerTask('test-phantom', [ 'shell:test-phantom' ]);
  grunt.registerTask('test-local', [ 'shell:test-local' ]);

  grunt.registerTask('build', [
    'clean',
    'shell:data',
    'browserify',
    'uglify'
  ]);

};

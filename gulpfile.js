var Path = require('path');
var ChildProcess = require('child_process');
var Gulp = require('gulp');
var Jshint = require('gulp-jshint');
var Mocha = require('gulp-mocha');
var Karma = require('karma');
var Rimraf = require('rimraf');
var Browserify = require('browserify');
var Gutil = require('gulp-util');
var Source = require('vinyl-source-stream');
var Buffer = require('vinyl-buffer');
var Uglify = require('gulp-uglify');
var Rename = require('gulp-rename');
var Pkg = require('./package.json');


var internals = {};


internals.files = {
  test: [ 'test/**/*.js' ],
  src: [ 'index.js' ],
  other: [ 'gulpfile.js', 'build/build.js' ]
};


internals.files.all = internals.files.test.concat(internals.files.src, internals.files.other);


Gulp.task('lint', function () {

  return Gulp.src(internals.files.all)
    .pipe(Jshint({ predef: [ '-Promise' ] }))
    .pipe(Jshint.reporter('jshint-stylish'));
});


Gulp.task('test:node', [ 'lint' ], function () {

  return Gulp.src([ 'test/**/*.spec.js' ], { read: false })
    .pipe(Mocha());
});


Gulp.task('test:phantom', [ 'lint' ], function (done) {

  var server = new Karma.Server({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done);

  server.start();
});


Gulp.task('test', [ 'test:node', 'test:phantom' ]);


Gulp.task('clean', function (done) {

  Rimraf('data/rules.json', function (err) {
  
    if (err) { return done(err); }
    Rimraf('dist', done);
  });
});


Gulp.task('rules', [ 'clean' ], function (done) {

  ChildProcess.exec('node ' + Path.resolve('./data/build.js'), function (err) {

    done(err);
  });
});


Gulp.task('build', [ 'rules' ], function () {

  var bundler = Browserify('./index.js', {
    standalone: 'psl'
  });

  return bundler.bundle()
    .on('error', Gutil.log.bind(Gutil, 'Browserify error'))
    .pipe(Source(Pkg.name + '.js'))
    .pipe(Buffer())
    .pipe(Gulp.dest('dist'))
    .pipe(Uglify())
    .pipe(Rename({ extname: '.min.js' }))
    .pipe(Gulp.dest('dist'));
});


Gulp.task('watch', function () {

  Gulp.watch(internals.files.all, [ 'test:node', 'test:phantom' ]);
});


Gulp.task('default', [ 'build' ]);


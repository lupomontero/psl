'use strict';


const Path = require('path');
const ChildProcess = require('child_process');
const Gulp = require('gulp');
const Eslint = require('gulp-eslint');
const Mocha = require('gulp-mocha');
const Karma = require('karma');
const Rimraf = require('rimraf');
const Browserify = require('browserify');
const Gutil = require('gulp-util');
const Source = require('vinyl-source-stream');
const Buffer = require('vinyl-buffer');
const Uglify = require('gulp-uglify');
const Rename = require('gulp-rename');
const Pkg = require('./package.json');


const internals = {};


internals.files = {
  test: ['test/**/*.js'],
  src: ['index.js'],
  other: ['gulpfile.js', 'build/build.js']
};


internals.files.all = internals.files.test.concat(internals.files.src, internals.files.other);


Gulp.task('lint', () => {

  return Gulp.src(internals.files.all)
    .pipe(Eslint())
    .pipe(Eslint.format())
    .pipe(Eslint.failAfterError());
});


Gulp.task('test:node', ['lint'], () => {

  return Gulp.src(['test/**/*.spec.js'], { read: false }).pipe(Mocha());
});


Gulp.task('test:phantom', ['lint'], (done) => {

  const server = new Karma.Server({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, (exitCode) => {

    if (exitCode) {
      return done(new Error('failed karma tests'));
    }
    done();
  });

  server.start();
});


Gulp.task('test', ['test:node', 'test:phantom']);


Gulp.task('clean', (done) => {

  Rimraf('data/rules.json', (err) => {

    if (err) {
      return done(err);
    }
    Rimraf('dist', done);
  });
});


Gulp.task('rules', ['clean'], (done) => {

  ChildProcess.exec('node ' + Path.resolve('./data/build.js'), (err) => {

    done(err);
  });
});


Gulp.task('build', ['rules'], () => {

  const bundler = Browserify('./index.js', {
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


Gulp.task('watch', () => {

  Gulp.watch(internals.files.all, ['test:node', 'test:phantom']);
});


Gulp.task('default', ['build']);


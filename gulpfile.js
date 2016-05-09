'use strict'

var gulp = require('gulp')
var browserify = require('browserify')
var babelify = require('babelify')
var source = require('vinyl-source-stream')

gulp.task('hey', function() {
  console.log('hey!');
})

gulp.task('js', function() {
  return browserify({
    extensions: ['.jsx', '.js'],
    entries: 'src/js/script.jsx'
  })
  .transform(babelify.configure({
    presets: ['es2015', 'react']
  }))
  .bundle()
  .on('error', function(error) {
    console.log('Error: ' + error.message);
  })
  .pipe(source('bundle.js'))
  .pipe(gulp.dest('dist/js'))
})

gulp.task('html', function() {
  return gulp.src('src/index.html')
    .pipe(gulp.dest('./dist/'))
})

gulp.task('css', function() {
  return gulp.src('src/style.css')
    .pipe(gulp.dest('./dist/'))
})

gulp.task('build', ['js', 'html', 'css'], function(){})

/* global require */

const
  babel = require('gulp-babel'),
  connect = require('gulp-connect'),
  cssnano = require('gulp-cssnano'),
  del = require('del'),
  eslint = require('gulp-eslint'),
  gulp = require('gulp'),
  mustache = require('gulp-mustache'),
  rename = require('gulp-rename'),
  sass = require('gulp-sass'),
  sourcemaps = require('gulp-sourcemaps'),
  uglify = require('gulp-uglify')

////////////////////////////////////////////////////////////////////////////////

gulp.task('cleanup', () => del(['./dist/']))

////////////////////////////////////////////////////////////////////////////////

const scriptsGlob = ['./src/**/*.js']

function gulpScripts() {
  return gulp.src(scriptsGlob)
    .pipe(mustache())
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(babel())
    .pipe(gulp.dest('./dist/'))
    .pipe(rename((path) => path.basename += '.min'))
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./dist/'))
}

gulp.task('scripts', ['cleanup'], () => gulpScripts())
gulp.task('scripts-serve', () => gulpScripts().pipe(connect.reload()))

////////////////////////////////////////////////////////////////////////////////

const stylesGlob = ['./src/**/*.scss']

function gulpStyles() {
  return gulp.src(stylesGlob)
    .pipe(mustache())
    .pipe(sass())
    .pipe(gulp.dest('./dist/'))
    .pipe(rename((path) => path.basename += '.min'))
    .pipe(sourcemaps.init())
    .pipe(cssnano())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./dist/'))
}

gulp.task('styles', ['cleanup'], () => gulpStyles())
gulp.task('styles-serve', () => gulpStyles().pipe(connect.reload()))

////////////////////////////////////////////////////////////////////////////////

const docsGlob = ['./src/**/*.html']

function gulpDocs() {
  return gulp.src(docsGlob)
    .pipe(mustache())
    .pipe(gulp.dest('./dist/'))
}

gulp.task('docs', ['cleanup'], () => gulpDocs())
gulp.task('docs-serve', () => gulpDocs().pipe(connect.reload()))

////////////////////////////////////////////////////////////////////////////////

gulp.task('default', ['cleanup', 'scripts', 'styles', 'docs'])

gulp.task('serve', ['default'], () => {
  connect.server({
    livereload: true,
    root: ''
  });

  gulp.watch(scriptsGlob, ['scripts-serve'])
  gulp.watch(stylesGlob, ['styles-serve'])
  gulp.watch(docsGlob, ['docs-serve'])
})

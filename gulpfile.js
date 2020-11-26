var gulp = require('gulp');
var plumber = require('gulp-plumber');
var rename = require('gulp-rename');
var cleanCss = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var minifyHtml = require('gulp-minify-html');

gulp.task('css', function (done) {
  gulp.src(['src/css/**/*.css'])
    .pipe(plumber({
      handleError: function (err) {
        console.log(err);
        this.emit('end');
      }
    }))
    .pipe(concat('style.css'))
    .pipe(gulp.dest('build/styles'))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(cleanCss())
    .pipe(gulp.dest('build/styles'))
  done();
});
gulp.task('js', function (done) {
  gulp.src(['src/js/**/*.js'])
    .pipe(plumber({
      handleError: function (err) {
        console.log(err);
        this.emit('end');
      }
    }))
    .pipe(concat('script.js'))
    .pipe(gulp.dest('build/scripts'))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(uglify())
    .pipe(gulp.dest('build/scripts'));
  done();
});
gulp.task('html', function (done) {
  gulp.src('src/index.html')
    .pipe(plumber({
      handleError: function (err) {
        console.log(err);
        this.emit('end');
      }
    }))
    .pipe(minifyHtml())
    .pipe(gulp.dest('.'));
  done();
});

gulp.task('watch', function () {
  gulp.watch('src/js/**/*.js', gulp.series('js'));
  gulp.watch('src/css/**/*.css', gulp.series('css'));
  gulp.watch('src/index.html', gulp.series('html'));
});

gulp.task('deploy', gulp.series('js', 'css', 'html', function (done) {
  done();
}));

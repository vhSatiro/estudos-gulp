var gulp = require('gulp');
var inject = require('gulp-inject');
var webserver = require('gulp-webserver');
var htmlclean = require('gulp-htmlclean');
var cleanCSS = require('gulp-clean-css');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var del = require('del');
var war = require('gulp-war');
var zip = require('gulp-zip');
var gulpSequence = require('gulp-sequence');

var paths = {
    src: 'src/**/*',
    srcHTML: 'src/**/*.html',
    srcCSS: 'src/**/*.css',
    srcJS: 'src/**/*.js',

    tmp: 'tmp',
    tmpIndex: 'tmp/index.html',
    tmpCSS: 'tmp/**/*.css',
    tmpJS: 'tmp/**/*.js',

    dist: 'dist',
    distIndex: 'dist/index.html',
    distCSS: 'dist/**/*.css',
    distJS: 'dist/**/*.js'
};

gulp.task('default', ['watch']);

gulp.task('html', function () {
    return gulp.src(paths.srcHTML).pipe(gulp.dest(paths.tmp));
});

gulp.task('css', function () {
    return gulp.src(paths.srcCSS).pipe(gulp.dest(paths.tmp));
});

gulp.task('js', function () {
    return gulp.src(paths.srcJS).pipe(gulp.dest(paths.tmp));
});

gulp.task('copy', ['html', 'css', 'js']);

gulp.task('inject', ['copy'], function () {
    //copy is added as an dependency of inject, this means, that gulp will first execute copy, then inject.
    var css = gulp.src(paths.tmpCSS);
    var js = gulp.src(paths.tmpJS);
    return gulp.src(paths.tmpIndex)
        .pipe(inject(css, { relative: true }))
        .pipe(inject(js, { relative: true }))
        .pipe(gulp.dest(paths.tmp));
});

gulp.task('serve', ['inject'], function () {
    return gulp.src(paths.tmp)
        .pipe(webserver({
            port: 3000,
            livereload: true
        }));
});

gulp.task('watch', ['serve'], function () {
    gulp.watch(paths.src, function (event) {
        gulpSequence('clean', 'copy:dist', 'copy:dist', 'inject:dist')(function (err) {
            if (err) {
                console.log(err);
            }
        });
    });
});

gulp.task('html:dist', function () {
    console.log('htmlMin');
    return gulp.src(paths.srcHTML)
        .pipe(htmlclean())
        .pipe(gulp.dest(paths.dist));
});

gulp.task('css:dist', function () {
    console.log('cssMin');
    return gulp.src(paths.srcCSS)
        .pipe(cleanCSS())
        .pipe(gulp.dest(paths.dist));
});

gulp.task('js:dist', function () {
    console.log('jsMin');
    return gulp.src(paths.srcJS)
        .pipe(uglify())
        .pipe(gulp.dest(paths.dist));
});

gulp.task('copy:dist', ['html:dist', 'css:dist', 'js:dist'], function () {
    console.log('Copy');
});

gulp.task('inject:dist', function () {
    var css = gulp.src(paths.distCSS);
    var js = gulp.src(paths.distJS);
    console.log('Inject');
    return gulp.src(paths.distIndex)
        .pipe(inject(css, { relative: true }))
        .pipe(inject(js, { relative: true }))
        .pipe(gulp.dest(paths.dist));
});

gulp.task('build', ['inject:dist']);

gulp.task('clean', function () {
    console.log('Clean');
    del([paths.tmp, paths.dist]);
});

gulp.task('war', function () {
    gulp.src([paths.dist])
        .pipe(war({
            welcome: 'index.html',
            displayName: 'Grunt WAR',
        }))
        .pipe(zip('myApp.zip'))
        .pipe(gulp.dest("./dist"));
});
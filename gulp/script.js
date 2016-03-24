var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var ngAnnotate = require('gulp-ng-annotate');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('js:common', function () {
    return gulp.src([
            //必须按顺序将内容压缩进去,否则不能正常执行
            'static/scripts/angular.js',
            'static/scripts/angular-route.js',
            'static/scripts/ng-file-upload-shim.js',
            'static/scripts/ng-file-upload.js',
            'static/scripts/jquery.js',
            'static/scripts/socket.io.js',
            'static/scripts/underscore.js'
        ])
        .pipe(concat('common.js'))
        .pipe(uglify())
        .pipe(gulp.dest('assets'));
});

gulp.task('js:custom', function () {
    return gulp.src([
            //必须按顺序将内容压缩进去,否则不能正常执行
            'static/scripts/admin/**/*.js',
            'static/scripts/orders/**/*.js',
            'packs/**/client/routes.js',
            'packs/**/client/controllers/*.js'
        ])
        .pipe(sourcemaps.init())    //Debug需要
        .pipe(ngAnnotate())         //uglify需要
        .pipe(concat('site.js'))
        //.pipe(uglify())             //生产环境需要
        .pipe(sourcemaps.write())   //Debug需要
        .pipe(gulp.dest('assets'));
});

gulp.task('watch:js', ['js:common', 'js:custom'], function () {
    gulp.watch([
        'static/scripts/angular.js',
        'static/scripts/angular-route.js',
        'static/scripts/ng-file-upload-shim.js',
        'static/scripts/ng-file-upload.js',
        'static/scripts/jquery.js',
        'static/scripts/socket.io.js',
        'static/scripts/underscore.js',
        'packs/**/client/routes.js',
        'packs/**/client/controllers/*.js',
        'static/scripts/orders/**/*.js'
    ], ['js:common', 'js:custom']);
});
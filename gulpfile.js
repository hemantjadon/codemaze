var gulp = require('gulp');
var watch = require('gulp-watch');
var minify = require('gulp-minify');

var less = require('gulp-less');
var LessPluginCleanCSS = require('less-plugin-clean-css');
var LessPluginAutoPrefix = require('less-plugin-autoprefix');
var cleancss = new LessPluginCleanCSS({ advanced: true });
var autoprefix = new LessPluginAutoPrefix({ browsers: ["last 2 versions"] });

var config = require('./gulp.config')();

gulp.task('compile-less', function () {
    console.log(config.jsOutputPath);
    return gulp.src([config.allLessFiles])
        .pipe(less({
            plugins: [autoprefix, cleancss]
        }))
        .pipe(gulp.dest(config.lessOutputPath));
});

gulp.task('minify-js',function () {
     return gulp.src([config.allJsFiles])
        .pipe(minify({ }))
        .pipe(gulp.dest(config.jsOutputPath));
});

gulp.task('watch',function () {
    watch([config.allLessFiles,config.allJsFiles],function(){
        gulp.start('compile-less');
        gulp.start('minify-js');
    });
});

gulp.task('default',['compile-less','minify-js','watch']);

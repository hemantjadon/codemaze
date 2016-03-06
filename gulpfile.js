var gulp = require('gulp');
var watch = require('gulp-watch');
var less = require('gulp-less');
var LessPluginCleanCSS = require('less-plugin-clean-css');
var LessPluginAutoPrefix = require('less-plugin-autoprefix');
var cleancss = new LessPluginCleanCSS({ advanced: true });
var autoprefix = new LessPluginAutoPrefix({ browsers: ["last 2 versions"] });

var config = require('./gulp.config')();

gulp.task('compile-less',function () {
    return gulp.src([config.allLessFiles])
        .pipe(less({
            plugins: [autoprefix, cleancss]
        }))
        .pipe(gulp.dest(config.lessOutputPath));
});

gulp.task('watch',function () {
    watch(config.allLessFiles,function(){
        gulp.start('compile-less');
    });
});

gulp.task('default',['compile-less','watch']);

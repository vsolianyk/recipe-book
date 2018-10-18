var gulp = require('gulp');
var path = require('path');
var less = require('gulp-less');
var cssmin = require('gulp-cssmin');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var imagemin = require('gulp-imagemin');
var browserify = require('browserify');
var babel = require('babelify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var browserSync = require('browser-sync');

var sourcePath = './src/';
var distPath = './build/';

gulp.task('less', function() {
    gulp.src(path.join(sourcePath, 'less/**/*.less'))
        .pipe(less())
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest(path.join(distPath, 'css/')))
        .pipe(browserSync.stream({match: '**/*.css'}));
});

gulp.task('less:prod', function() {
    gulp.src(path.join(sourcePath, 'less/**/*.less'))
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(cssmin())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(path.join(distPath, 'css/')));
});

gulp.task('js', function() {
    browserify(path.join(sourcePath, 'js/main.js'), { debug: true })
        .transform(babel).bundle()
        .on('error', function(err) { console.error(err); this.emit('end'); })
        .pipe(source('main.js'))
        .pipe(buffer())
        .pipe(gulp.dest(path.join(distPath, 'js/')));

});

gulp.task('js:prod', function() {
    browserify(path.join(sourcePath, 'js/main.js'), { debug: false }).transform(babel).bundle()
        .pipe(sourcemaps.init())
        .pipe(concat('main.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(path.join(distPath, 'js/')));

});

gulp.task('images', function() {
    gulp.src(path.join(sourcePath, 'img/**/*.+(png|jpg|jpeg)'))
        .pipe(imagemin([
            imagemin.jpegtran({quality: 90, progressive: true}),
            imagemin.optipng({optimizationLevel: 5})
        ]))
        .pipe(gulp.dest(path.join(distPath, 'img/')));
});

gulp.task('copy', function() {
    gulp.src(path.join(sourcePath, '*.html'))
        .pipe(gulp.dest(distPath));
    gulp.src(path.join(sourcePath, 'fonts/**/*.+(woff|ttf)'))
        .pipe(gulp.dest(path.join(distPath, 'fonts/')));
    gulp.src(path.join(sourcePath, 'api/**/*.json'))
        .pipe(gulp.dest(path.join(distPath, 'api/')));
});

gulp.task('watch', function() {
    gulp.watch(path.join(sourcePath, 'less/**/*.less'), ['less'], browserSync.reload); 
    gulp.watch(path.join(sourcePath, 'js/**/*.js'), ['js'], browserSync.reload); 
    gulp.watch(path.join(sourcePath, 'img/**/*.+(png|jpg|jpeg)'), ['images'], browserSync.reload); 
    gulp.watch(path.join(sourcePath, '*.html'), ['copy']).on('change', browserSync.reload);
});

gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: distPath
        }
    });
});


gulp.task('dev', ['copy', 'less', 'js', 'browser-sync', 'watch']);

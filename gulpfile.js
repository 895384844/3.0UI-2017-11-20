var gulp        = require('gulp'),
    templates   = require('gulp-angular-templatecache'),
    minifyHTML  = require('gulp-minify-html'),
    minifyCSS   = require('gulp-clean-css'),
    jshint      = require('gulp-jshint'),
    clean       = require('gulp-clean'),
    rjs         = require('gulp-requirejs'),
    uglify      = require('gulp-uglify'),
    concat      = require('gulp-concat'),
    htmlReplace = require('gulp-html-replace'),
    tmpl        = require('gulp-template'),
    rename      = require('gulp-rename'),
    replace     = require('gulp-replace'),
    _           = require('lodash'),
    connect     = require('gulp-connect'),
    prefix      = require('gulp-autoprefixer'),
    fs          = require('fs');

var props = fs.readFileSync('project.properties', 'utf-8');
var version = props.match(/version="([^\n]*)"/)[1];

BUILD_VERSION = version + '-release';

gulp.task('default', ['compilejs','minifycss'], function() {
    gulp.src('app/js/nocache.tmpl')
        .pipe(tmpl({
            version: BUILD_VERSION
        }))
        .pipe(rename('nocache.js'))
        .pipe(gulp.dest('build'));

    return gulp.src('app/index.html')
        .pipe(htmlReplace({
            'css': 'css/styles.css',
            'js': BUILD_VERSION + '/webapp.js'
        }))
        .pipe(gulp.dest('build'));
});

// Alias for the default task
gulp.task('package', ['default']);

gulp.task('clean', function(cb) {
    gulp.src('build')
        .pipe(clean())
        .on('end', cb);
});

gulp.task('copy', ['clean'], function() {
    gulp.src([
       'app/bower_components/jquery-ui-bootstrap/css/custom-theme/images/*.*'
    ]).pipe(gulp.dest('build/images/'));

    gulp.src([
       'app/bower_components/bootstrap/dist/fonts/*.*'
    ]).pipe(gulp.dest('build/fonts/'));

    var paths = [
        'app/images/**',
        'app/fonts/**'
    ];
    return gulp.src(paths, {
        base: './app'
    }).pipe(gulp.dest('build'));
});

gulp.task('minifycss',['clean'], function() {
  return gulp.src('app/css/styles.css')
    //.pipe(minifyCSS({compatibility: 'ie8',rebase:false}))
    .pipe(replace('url(images/', 'url(/images/'))
    .pipe(gulp.dest('build/css'));
});


gulp.task('compilejs', [ 'copy', 'templates', 'jshint'], function() {
    function almond() {
        var s = gulp.src('build/*.js');
        s.pipe(concat('webapp.js'))
            .pipe(uglify())
            .pipe(gulp.dest('build/' + BUILD_VERSION));
        s.pipe(clean());
    }

    return gulp.src('app/bower_components/almond/almond.js')
        .pipe(gulp.dest('build'))
        .pipe(rjs({
            out: 'require.config.js',
            baseUrl: 'app/js/',
            name: 'require.config',
            mainConfigFile: 'app/js/require.config.js'
        }))
        .pipe(gulp.dest('build'))
        .on('end', almond);
});

gulp.task('templates', function() {
    return gulp.src('app/js/modules/**/*.html')
        .pipe(minifyHTML({
            quotes: true,
            empty: true
        }))
        .pipe(templates({
            standalone: true,
            filename: 'template.js',
            module: 'template'
        }))
        .pipe(gulp.dest('app/js'))
        .pipe(connect.reload());
});

gulp.task('jshint', function() {
    var stream = gulp.src('app/js/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter(require('jshint-stylish')));
    if (!isWatch) {
        stream.pipe(jshint.reporter('fail'));
    }
    return stream;
});

var isWatch = false;
gulp.task('watch', ['templates',  'jshint'], function() {
    isWatch = true;
    gulp.watch('app/js/**/*.html', ['templates']);
    gulp.watch(['app/js/**/*.js', 'tests/**/*.js'], ['jshint']);
});
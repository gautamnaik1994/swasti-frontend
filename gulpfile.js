var gulp = require('gulp');
var panini = require('panini');

const autoprefixer = require('gulp-autoprefixer');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;
// var uglify = require('gulp-uglify');
// var pump = require('pump');

var sourcemaps = require('gulp-sourcemaps');


var src = {
    scss: 'src/scss/**/*.scss',
    css: 'src/css',
    html: 'src/html/**/*.html',
    img: 'src/img/**/*.*',
    js: 'src/js/**/*.*',
};


gulp.task('copyAssets', function (done) {
    gulp.src(['./src/img/**/*.*'])
        .pipe(gulp.dest('./build/img'));
    done();
});

gulp.task('copyJS', function (done) {
    gulp.src(['./src/js/**/*.*'])
        .pipe(gulp.dest('./build/js'));
    done();
});

gulp.task('flathtml', function (done) {
    gulp.src('src/html/pages/*.html')
        .pipe(panini({
            root: 'src/html/pages/',
            layouts: 'src/html/layouts/',
            partials: 'src/html/partials/',
            helpers: 'src/html/helpers/',
            data: 'src/html/data/'
        }))
        .pipe(gulp.dest('build'));
    done()
});

gulp.task("resetPages", done => {
    panini.refresh()
    done()
  })

gulp.task('sass', function (done) {
    return gulp.src('src/scss/app.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({
            includePaths: ['node_modules'],
            outputStyle: 'compact',
        }, {
            errLogToConsole: true
        }))
        .on('error', function (err) {
            console.log(err.toString());

            this.emit('end');
        })
        .pipe(sourcemaps.write())
        .pipe(sourcemaps.init({
            loadMaps: true
        }))
        .pipe(autoprefixer("last 2 versions", "> 1%"))
        .pipe(gulp.dest('build/css'))
        .pipe(reload({
            stream: true
        }));
});

gulp.task('serve', gulp.series('sass', 'flathtml', 'copyAssets', 'copyJS', function (done) {
    browserSync.init({
        server: "./build",
        port: 8080,
    });
    gulp.watch(src.scss, gulp.series('sass', function (done) {
        done()
    }));
    gulp.watch(src.html, gulp.series('resetPages', 'flathtml', function (done) {
        reload();
        done()
    }));
    gulp.watch(src.img, gulp.series('copyAssets', function (done) {
        reload();
        done()
    })); gulp.watch(src.js, gulp.series('copyJS', function (done) {
        reload();
        done()
    }));
    // gulp.watch('./src/{layouts,partials,helpers,data}/**/*', );
    // gulp.watch(['./src/{layouts,partials,helpers,data}/**/*'], [panini.refresh]);
    // gulp.watch(src.html).on('change', reload);
    done()
}));

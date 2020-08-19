const gulp = require('gulp')
const gulpIf = require('gulp-if')
const browserSync = require('browser-sync').create()
const sass = require('gulp-sass')
const htmlmin = require('gulp-htmlmin')
const cssmin = require('gulp-cssmin')
const purgecss = require('gulp-purgecss')
const uglify = require('gulp-uglify')
const imagemin = require('gulp-imagemin')
const concat = require('gulp-concat')
const jsImport = require('gulp-js-import')
const sourcemaps = require('gulp-sourcemaps')
const fileInclude = require('gulp-file-include')
const clean = require('gulp-clean')

const isProd = process.env.NODE_ENV === 'prod'

const htmlFiles = [
    'src/pages/**/*.html'
]

const htmlFilesForPurgeCSS = [ 
    'src/partials/**/*.html',
    'src/pages/**/*.html'
]

const html = () => {
    return gulp.src(htmlFiles)
        .pipe(fileInclude({
            prefix: '@@',
            basePath: '@file'
        }))
        .pipe(gulpIf(isProd, htmlmin({
            collapseWhitespace: true
        })))
        .pipe(gulp.dest('docs'))
}

const rawPages = () => {
    return gulp.src('src/pages-raw/**/*')
        .pipe(gulp.dest('docs'))
}

const staticFiles = () => {
    return gulp.src(['src/CNAME', 'src/keybase.txt'])
        .pipe(gulp.dest('docs'))
}

const css = () => {
    return gulp.src('src/sass/style.scss')
        .pipe(gulpIf(!isProd, sourcemaps.init()))
        .pipe(sass({
            includePaths: ['node_modules']
        }).on('error', sass.logError))
        .pipe(gulpIf(!isProd, sourcemaps.write()))
        .pipe(gulpIf(isProd, purgecss({
            content: htmlFilesForPurgeCSS,
            whitelistPatterns: [/^navbar-light$/, /^navbar-dark$/, /pulse$/],
            whitelistPatternsChildren: [/^navbar-light$/, /^navbar-dark$/],
        })))
        .pipe(gulpIf(isProd, cssmin()))
        .pipe(gulp.dest('docs/css'))
}

const js = () => {
    return gulp.src(['node_modules/aos/dist/aos.js', 'src/js/*.js'])
        .pipe(jsImport({
            hideConsole: false
        }))
        .pipe(concat('all.js'))
        .pipe(gulpIf(isProd, uglify()))
        .pipe(gulp.dest('docs/js'))
}

const img = () => {
    return gulp.src('src/img/**')
        .pipe(gulpIf(isProd, imagemin()))
        .pipe(gulp.dest('docs/img'))
}

const serve = () => {
    browserSync.init({
        open: true,
        server: './docs'
    })
}

const browserSyncReload = (done) => {
    browserSync.reload()
    done()
}


const watchFiles = () => {
    gulp.watch('src/**/*.html', gulp.series(html, browserSyncReload))
    gulp.watch('src/**/*.scss', gulp.series(css, browserSyncReload))
    gulp.watch('src/**/*.js', gulp.series(js, browserSyncReload))
    gulp.watch('src/img/**/*.*', gulp.series(img))
    return
}

const del = () => {
    return gulp.src('docs/*', { read: false })
        .pipe(clean())
}

exports.css = css
exports.html = html
exports.js = js
exports.del = del
exports.serve = gulp.parallel(staticFiles, html, rawPages, css, js, img, watchFiles, serve)
exports.default = gulp.series(del, staticFiles, html, rawPages, css, js, img)
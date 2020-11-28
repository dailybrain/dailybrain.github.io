const gulp = require('gulp')
const gulpIf = require('gulp-if')
const clean = require('gulp-clean')
const fileInclude = require('gulp-file-include')

const htmlmin = require('gulp-htmlmin')
const sass = require('gulp-sass')
const cssmin = require('gulp-cssmin')
const purgecss = require('gulp-purgecss')
const autoprefixer = require('gulp-autoprefixer')

const rollup = require('gulp-better-rollup')
const sourcemaps = require('gulp-sourcemaps')
const babel = require('rollup-plugin-babel')
const resolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')
const terser = require('rollup-plugin-terser').terser

const responsive = require('gulp-responsive')
const sitemap = require('gulp-sitemap')

const browserSync = require('browser-sync').create()

const isProd = process.env.NODE_ENV === 'prod'

const html = () => {
    return gulp
    .src(['src/pages/**/*.html'])
    .pipe(fileInclude({
        prefix: '@@',
        basePath: '@file'
    }))
    .pipe(gulpIf(isProd, htmlmin({
        collapseWhitespace: true
    })))
    .pipe(gulp.dest('docs'))
}

const sitemapXml = () => {
    return gulp
    .src('src/pages/**/*.html', {
        read: false
    })
    .pipe(sitemap({
        siteUrl: 'https://dailybrain.fr'
    }))
    .pipe(gulp.dest('docs'))
}

const assets = () => {
    return gulp
    .src(['src/assets/**/*', 'src/favicons/*'])
    .pipe(gulp.dest('docs'))
}

const jpg = () => {
    return gulp
    .src('src/img/**/*.jpg')
    .pipe(
        responsive(
            {
                '**/*.jpg': [
                    {

                    }
                ],
                'landings/*.jpg': [
                    {
                        width: 600,
                        rename: { suffix: '-600px' }               
                    },
                    {
                        width: 800,
                        rename: { suffix: '-800px' }                
                    },
                    {
                        width: 1000,
                        rename: { suffix: '-1000px' }               
                    },
                    {
                        width: 1200,
                        rename: { suffix: '-1200px' }               
                    },
                    {
                        width: 1400,
                        rename: { suffix: '-1400px' }               
                    },
                    {
                        width: 1920,
                        rename: { suffix: '-1920px' }               
                    }
                ],
                'testimonials/*.jpg': [
                    {
                        width: 60
                    }
                ]
            },
            // default settings for all
            {
                quality: 85,
                progressive: true,
                withMetadata: false
            }
        )
    )
    .pipe(gulp.dest('docs/img'))
}

const png = () => {
    return gulp
    .src('src/img/**/*.png')
    .pipe(gulp.dest('docs/img'))
}

const svg = () => {
    return gulp
    .src('src/img/**/*.svg')
    .pipe(gulp.dest('docs/img'))
}

const images = async () => {
    return await [
        jpg(), 
        png(), 
        svg()
    ]
}

const css = () => {
    return gulp
    .src('src/sass/*.scss')
    .pipe(gulpIf(!isProd, sourcemaps.init()))
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(gulpIf(!isProd, sourcemaps.write('')))
    .pipe(gulpIf(isProd, purgecss({
        content: [ 
            'src/partials/**/*.html',
            'src/pages/**/*.html'
        ],
        safelist: {
            standard: [
                'navbar-dark', 
                'navbar-light',
                'pulse'
            ],
            deep: [/^carousel/,/^aos/,/^data-aos/,/^btn-scroll-top/]
        },
    })))
    .pipe(gulpIf(isProd, cssmin()))
    .pipe(gulp.dest('docs/css'))
}

const js = () => {
    return gulp
    .src('src/js/*.js')
    .pipe(gulpIf(!isProd, sourcemaps.init()))
    .pipe(gulpIf(!isProd, rollup({ plugins: [babel(), resolve(), commonjs()] }, 'umd')))
    .pipe(gulpIf(isProd, rollup({ 
        plugins: [
            babel(), 
            resolve(), 
            commonjs(), 
            terser(                  
                    {
                        format: {
                            comments: false
                        },
                        compress: {
                            drop_console: true 
                        }
                    }
                )
            ] 
        }, 
        'umd'
        )
    ))
    .pipe(gulpIf(!isProd, sourcemaps.write('')))
    .pipe(gulp.dest('docs/js'))
}

const del = () => {
    return gulp
    .src('docs/*', { read: false })
    .pipe(clean())
}

const serve = () => {
    browserSync.init({
        open: false,
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
    gulp.watch('src/img/**/*.*', gulp.series(images))
    return
}

exports.html = html
exports.css = css
exports.js = js
exports.del = del
exports.serve = gulp.parallel(html, sitemapXml, assets, images, css, js, watchFiles, serve)
exports.default = gulp.series(del, html, sitemapXml, assets, images, css, js)
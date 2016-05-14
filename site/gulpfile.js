// IMPORTS

const babelify = require('babelify')
const sync = require('browser-sync')
const browserify = require('browserify')
const gulp = require('gulp')
const autoprefixer = require('gulp-autoprefixer')
const changed = require('gulp-changed')
const nano = require('gulp-cssnano')
const fileinclude = require('gulp-file-include')
const htmlmin = require('gulp-htmlmin')
const imagemin = require('gulp-imagemin')
const plumber = require('gulp-plumber')
const sass = require('gulp-sass')
const sourcemaps = require('gulp-sourcemaps')
const uglify = require('gulp-uglify')
const assign = require('lodash.assign')
const notifier = require('node-notifier')
const buffer = require('vinyl-buffer')
const source = require('vinyl-source-stream')
const watchify = require('watchify')

// ERROR HANDLER

const onError = function(error) {
  notifier.notify({
    'title': 'Error',
    'message': 'Compilation failure.'
  })

  console.log(error)
  this.emit('end')
}

// HTML

gulp.task('html', () => {
  return gulp.src('src/html/**/*.html')
    .pipe(plumber({ errorHandler: onError }))
    .pipe(fileinclude({ prefix: '@', basepath: 'src/' }))
    .pipe(htmlmin({ collapseWhitespace: true, removeComments: true }))
    .pipe(gulp.dest('dist'))
})

// SASS

gulp.task('sass', () => {
  return gulp.src('src/sass/style.scss')
    .pipe(plumber({ errorHandler: onError }))
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(autoprefixer({ browsers: [ 'last 2 versions', 'ie >= 9', 'Android >= 4.1' ] }))
    .pipe(nano({ safe: true }))
    .pipe(sourcemaps.write('./maps', { addComment: false }))
    .pipe(gulp.dest('dist'))
})

// JS

const browserifyArgs = {
  entries: 'src/js/main.js',
  debug: true,
  transform: [ 'babelify' ]
}

const watchifyArgs = assign(watchify.args, browserifyArgs)
const bundler = watchify(browserify(watchifyArgs))

const build = () => {
  console.log('Bundling started...')
  console.time('Bundling finished')

  return bundler
    .bundle()
    .on('error', onError)
    .on('end', () => console.timeEnd('Bundling finished'))
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(uglify())
    .pipe(sourcemaps.write('./maps', { addComment: false }))
    .pipe(gulp.dest('dist'))
    .pipe(sync.stream())
}

bundler.on('update', build)
gulp.task('js', build)

// IMAGES

gulp.task('images', () => {
  return gulp.src('src/images/**/*.{gif,jpg,png,svg}')
    .pipe(plumber({ errorHandler: onError }))
    .pipe(changed('dist'))
    .pipe(imagemin({ progressive: true, interlaced: true }))
    .pipe(gulp.dest('dist/images'))
})

// VIDEOS, FONTS, FAVICON

const inputs = [
  '/videos/**/*',
  '/fonts/**/*.{eot,svg,ttf,woff,woff2}',
  '/favicon.ico'
]

const outputs = [
  '/videos',
  '/fonts',
  ''
]

;['videos', 'fonts', 'favicon'].forEach((name, index) => {
  gulp.task(name, () => {
    return gulp.src('src' + inputs[index])
      .pipe(plumber({ errorHandler: onError }))
      .pipe(gulp.dest('dist' + outputs[index]))
  })
})

// SERVER

const server = sync.create()
const reload = sync.reload

const sendMaps = (req, res, next) => {
  const filename = req.url.split('/').pop()
  const extension = filename.split('.').pop()

  if(extension === 'css' || extension === 'js') {
    res.setHeader('X-SourceMap', '/maps/' + filename + '.map')
  }

  return next()
}

const options = {
  notify: false,
  server: {
    baseDir: 'dist',
    middleware: [
      sendMaps
    ]
  },
  watchOptions: {
    ignored: '*.map'
  }
}

gulp.task('server', () => sync(options))

// WATCH

gulp.task('watch', () => {
  gulp.watch('src/html/**/*.html', ['html', reload])
  gulp.watch('src/sass/**/*.scss', ['sass', reload])
  gulp.watch('src/images/**/*.{gif,jpg,png,svg}', ['images', reload])
})

// BUILD & DEFAULT TASK

gulp.task('build', ['html', 'sass', 'js', 'images', 'videos', 'fonts', 'favicon'])
gulp.task('default', ['server', 'build', 'watch'])

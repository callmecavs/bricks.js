const prefixer = require('autoprefixer')
const sync     = require('browser-sync')
const cssnano  = require('cssnano')
const del      = require('del')
const fs       = require('fs')
const gulp     = require('gulp')
const changed  = require('gulp-changed')
const include  = require('gulp-file-include')
const htmlmin  = require('gulp-htmlmin')
const imagemin = require('gulp-imagemin')
const plumber  = require('gulp-plumber')
const postcss  = require('gulp-postcss')
const sass     = require('gulp-sass')
const maps     = require('gulp-sourcemaps')
const notifier = require('node-notifier')
const rollup   = require('rollup')
const babel    = require('rollup-plugin-babel')
const commonjs = require('rollup-plugin-commonjs')
const resolve  = require('rollup-plugin-node-resolve')
const uglify   = require('rollup-plugin-uglify')
const rucksack = require('rucksack-css')

// error handler

const onError = function(error) {
  notifier.notify({
    'title': 'Error',
    'message': 'Compilation failure.'
  })

  console.log(error)
  this.emit('end')
}

// clean

gulp.task('clean', () => del('dist'))

// html

gulp.task('html', ['images'], () => {
  return gulp.src('src/html/**/*.html')
    .pipe(plumber({ errorHandler: onError }))
    .pipe(include({ prefix: '@', basepath: 'dist/images/' }))
    .pipe(htmlmin({ collapseWhitespace: true, removeComments: true }))
    .pipe(gulp.dest('dist'))
})

// sass

const processors = [
  rucksack({ inputPseudo: false, quantityQueries: false }),
  prefixer({ browsers: 'last 2 versions' }),
  cssnano({ safe: true })
]

gulp.task('sass', () => {
  return gulp.src('src/sass/style.scss')
    .pipe(plumber({ errorHandler: onError }))
    .pipe(maps.init())
    .pipe(sass())
    .pipe(postcss(processors))
    .pipe(maps.write('./maps', { addComment: false }))
    .pipe(gulp.dest('dist'))
})

// js

const read = {
  entry: 'src/js/main.js',
  sourceMap: true,
  plugins: [
    resolve({ jsnext: true, main: true }),
    commonjs(),
    babel({ exclude: 'node_modules/**' }),
    uglify()
  ]
}

const write = {
  format: 'iife',
  sourceMap: true
}

gulp.task('js', () => {
  return rollup
    .rollup(read)
    .then(bundle => {
      // generate the bundle
      const files = bundle.generate(write)

      // write the files to dist
      fs.writeFileSync('dist/bundle.js', files.code)
      fs.writeFileSync('dist/maps/bundle.js.map', files.map.toString())
    })
})

// images

gulp.task('images', () => {
  return gulp.src('src/images/**/*.{gif,jpg,png,svg}')
    .pipe(plumber({ errorHandler: onError }))
    .pipe(changed('dist/images'))
    .pipe(imagemin({ progressive: true, interlaced: true }))
    .pipe(gulp.dest('dist/images'))
})

// fonts, videos, favicon

const others = [
  {
    name: 'fonts',
    src:  '/fonts/**/*.{woff,woff2}',
    dest: '/fonts'
  }, {
    name: 'videos',
    src:  '/videos/**/*',
    dest: '/videos'
  }, {
    name: 'favicon',
    src:  '/favicon.ico',
    dest: ''
  }
]

others.forEach(object => {
  gulp.task(object.name, () => {
    return gulp.src('src' + object.src)
      .pipe(plumber({ errorHandler: onError }))
      .pipe(gulp.dest('dist' + object.dest))
  })
})

// server

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

// watch

gulp.task('watch', () => {
  gulp.watch('src/html/**/*.html', ['html', reload])
  gulp.watch('src/sass/**/*.scss', ['sass', reload])
  gulp.watch('src/js/**/*.js', ['js', reload])
  gulp.watch('src/images/**/*.{gif,jpg,png,svg}', ['images', reload])
})

// build and default tasks

gulp.task('build', ['clean'], () => {
  // create dist directories
  fs.mkdirSync('dist')
  fs.mkdirSync('dist/maps')

  // run the tasks
  gulp.start('html', 'sass', 'js', 'images', 'fonts', 'videos', 'favicon')
})

gulp.task('default', ['build', 'server', 'watch'])

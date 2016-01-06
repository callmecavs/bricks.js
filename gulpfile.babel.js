// IMPORTS

import packageJSON from './package.json'

import babelify from 'babelify'
import browserify from 'browserify'
import gulp from 'gulp'
import connect from 'gulp-connect'
import header from 'gulp-header'
import sourcemaps from 'gulp-sourcemaps'
import uglify from 'gulp-uglify'
import assign from 'lodash.assign'
import notifier from 'node-notifier'
import buffer from 'vinyl-buffer'
import source from 'vinyl-source-stream'
import watchify from 'watchify'

// ERROR HANDLER

const onError = (error) => {
  notifier.notify({ 'title': 'Error', 'message': 'Compilation failed.' })
  console.log(error)
}

// ATTRIBUTION

const attribution = [
  '/*!',
  ' * Bricks.js <%= pkg.version %> - <%= pkg.description %>',
  ' * Copyright (c) ' + new Date().getFullYear() + ' <%= pkg.author %> - <%= pkg.homepage %>',
  ' * License: <%= pkg.license %>',
  ' */',
  ''
].join('\n')

// JS

const browserifyArgs = {
  debug: true,
  entries: 'src/bricks.js',
  standalone: 'Bricks'
}

const watchifyArgs = assign(watchify.args, browserifyArgs)
const bundler = watchify(browserify(watchifyArgs))

const build = () => {
  console.log('Bundling started...')
  console.time('Bundling finished')

  return bundler
    .transform(babelify.configure({
      presets: ['es2015'],
      plugins: ['add-module-exports']
    }))
    .bundle()
    .on('error', onError)
    .on('end', () => console.timeEnd('Bundling finished'))
    .pipe(source('bricks.min.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(uglify())
    .pipe(header(attribution, { pkg: packageJSON }))
    .pipe(sourcemaps.write('./maps', { addComment: false }))
    .pipe(gulp.dest('dist'))
    .pipe(connect.reload())
}

bundler.on('update', build)
gulp.task('js', build)

// SERVER

const sendMaps = (req, res, next) => {
  const filename = req.url.split('/').pop()
  const extension = filename.split('.').pop()

  if(extension === 'css' || extension === 'js') {
    res.setHeader('X-SourceMap', '/maps/' + filename + '.map')
  }

  return next()
}

gulp.task('server', () => {
  return connect.server({
    root: 'dist',
    port: 3000,
    livereload: true,
    middleware: (connect, opt) => {
      return [ sendMaps ]
    }
  })
})

// WATCH

gulp.task('default', ['js', 'server'])

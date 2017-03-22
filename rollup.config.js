import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'

const info = require('./package.json')

const config = {
  entry: 'src/bricks.js',
  plugins: [
    resolve(),
    babel({
      babelrc: false,
      presets: [
        [
          'env', {
            modules: false,
            targets: {
              browsers: ['last 2 versions']
            }
          }
        ]
      ]
    })
  ],
  targets: [
    {
      dest: info.main,
      format: 'umd',
      moduleName: 'Bricks'
    }, {
      dest: info.module,
      format: 'es'
    }
  ]
}

export default config

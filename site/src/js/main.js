import * as _ from './util'

import Bricks from './bricks.min.js'

// define Bricks options
const options = {
  container: '[data-grid]',
  packed: 'data-packed',
  sizes: [
    { columns: 2, gutter: 10 },
    { mq: '600px', columns: 3, gutter: 10 },
    { mq: '800px', columns: 4, gutter: 10 },
    { mq: '1000px', columns: 5, gutter: 10 },
    { mq: '1130px', columns: 6, gutter: 12 }
  ]
}

// create Bricks instance, adding resize handler
const instance = Bricks(options).resize()

const run = () => {
  const grid = document.querySelector('[data-grid]')
  const input = document.querySelector('[data-input]')
  const result = document.querySelector('[data-result]')

  // get input value
  const number = parseInt(input.value || input.getAttribute('placeholder'), 10)

  // generate boxes
  const frag = document.createDocumentFragment()

  _.times(number, () => {
    const div = document.createElement('div')

    // add grid item class
    div.classList.add('grid-item')

    // set random height
    div.style.height = `${ _.random(50, 350) }px`

    // append to fragment
    frag.appendChild(div)
  })

  // clear grid, then insert fragment
  grid.innerHTML = ''
  grid.appendChild(frag)

  // remove animating class to time
  result.classList.remove('is-animating')

  // set result
  result.textContent = `${ _.time(instance.pack) } ms`

  // add animating class to time
  result.classList.add('is-animating')
}

const main = () => {
  // bind reload button handlers
  _.toArray('[data-reload]').forEach(button => {
    button.addEventListener('click', event => {
      event.preventDefault()
      run()
    })
  })

  // run once on initial load
  run()
}

document.addEventListener('DOMContentLoaded', event => main())

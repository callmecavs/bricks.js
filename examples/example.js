// import Bricks

import bricks from 'bricks.js'

// define your grid at different breakpoints

const sizes = [
  { columns: 2, gutter: 10 },
  { mq: '768px', columns: 3, gutter: 25 },
  { mq: '1024px', columns: 4, gutter: 50 }
]

// create an instance

const instance = bricks({
  container: '.container',
  packed: 'data-packed',
  sizes: sizes
})

// bind callbacks

instance
  .on('pack', () => console.log('All grid items have been packed.'))
  .on('update', () => console.log('New grid items have been packed.'))
  .on('resize', (size) => console.log('The grid has be re-packed to accommodate a new breakpoint.'))

// start it up, when the DOM is ready

document.addEventListener('DOMContentLoaded', event => {
  instance
    .resize()     // bind resize handler
    .pack()       // pack initial items
})

// add new items via AJAX

fetch('path/to.html')
  .then(response => response.text())
  .then(html => {
    document.querySelector('.container').appendChild(html)

    // position them within the existing grid
    instance.update()
  })

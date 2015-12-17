import { times } from './util'

import knot from 'knot.js'

export default (options = {}) => {
  let size
  let heights

  const container = document.querySelector(options.container)
  const packed    = `data-${ options.packed }`
  const sizes     = options.sizes.reverse()

  const elements = {
    all:    `${ options.container } > *`,
    recent: `${ options.container } > *:not([${ packed }])`
  }

  function getElements(recent = false) {
    return [...document.querySelectorAll(recent ? elements.recent : elements.all)]
  }

  function getHeights(elements) {
    return heights = elements.map(element => element.clientHeight)
  }

  function getSizeIndex() {
    // get widest matching media query
    size = sizes
      .map(size => size.mq && window.matchMedia(size.mq).matches)
      .indexOf(true)
  }

  function getSize() {
    // if none match, use the narrowest media query
    return size === -1
      ? sizes[sizes.length - 1]
      : sizes[size]
  }

  function resize() {
    let timer

    function active() {
      timer !== undefined && clearTimeout(timer)
      timer = setTimeout(() => stop(), 250)
    }

    function stop() {

    }

    window.addEventListener('resize', () => active())
  }
}

// export default (options = {}) => {
//   // batch width and height calls, to avoid forced layouts
//   const elHeights = elements.map(element => element.clientHeight)

//   // initialize column heights
//   let colHeights = times(options.columns, 0)

//   // run through the items
//   elements.forEach((element, index) => {
//     // find index of shortest column
//     let target = colHeights.indexOf(Math.min(...colHeights))

//     // apply element transform
//     let top = colHeights[target]
//     let left = (target * options.width) + (target * options.gutter)

//     element.style.position = 'absolute'
//     element.style.transform = `translate3d(${ left }px, ${ top }px, 0)`

//     // update current column height
//     colHeights[target] += elHeights[index] + options.gutter
//   })

//   // set container width and height
//   container.style.position = 'relative'
//   container.style.width = `${ /* calculate this by column width */ + (options.gutter * (options.columns - 1)) }px`
//   container.style.height = `${ Math.max(...colHeights) - options.gutter }px`
// }

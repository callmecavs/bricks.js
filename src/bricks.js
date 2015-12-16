import { times } from './util'

import knot from 'knot.js'

export default (options = {}) => {
  let heights

  const container = document.querySelector(options.container)
  const packedAttr = `data-${ options.packed }`

  const elements = {
    all:    `${ options.container } > *`,
    recent: `${ options.container } > *:not([${ packedAttr }])`
  }

  function getElements(recent = false) {
    return [...document.querySelectorAll(recent ? elements.recent : elements.all)]
  }

  function getHeights(elements) {
    return heights = elements.map(element => element.clientHeight)
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

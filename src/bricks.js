import { times } from './util'

import knot from 'knot.js'

export default (options = {}) => {
  const packedAttr = `data-${ options.packed }`

  const selectors = {
    container: options.container,
    elements: {
      all:    `${ options.container } > *`,
      recent: `${ options.container } > *:not([${ packedAttr }])`
    }
  }

  function getContainer() {
    return document.querySelector(selectors.container)
  }

  function getElements(recent = false) {
    let elements = selectors.elements
    return [...document.querySelectorAll(recent ? elements.recent : elements.new)]
  }
}

// export default (options = {}) => {
//   // cache elements and container
//   const container = document.querySelector(options.container)
//   const elements = toArray(options.elements)

//   // batch width and height calls, to avoid forced layouts
//   const containerWidth = container.clientWidth
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
//   container.style.width = `${ containerWidth + (options.gutter * (options.columns - 1)) }px`
//   container.style.height = `${ Math.max(...colHeights) - options.gutter }px`
// }

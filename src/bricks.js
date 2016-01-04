import knot from 'knot.js'

export default (options = {}) => {
  let elements      // elements
  let heights       // element heights
  let columns       // column heights
  let size          // size index
  let details       // size details

  // options

  const container = document.querySelector(options.container)
  const packed    = `data-${ options.packed }`
  const sizes     = options.sizes.reverse()

  const selectors = {
    all:    `${ options.container } > *`,
    recent: `${ options.container } > *:not([${ packed }])`
  }

  // instance

  const instance = knot({

  })

  return instance

  // element helpers

  function getElements(recent = false) {
    elements = [...document.querySelectorAll(recent ? selectors.recent : selectors.all)]
  }

  function getElementHeights() {
    return elements.map(element => element.clientHeight)
  }

  function setElementStyles() {
    elements.forEach((element, index) => {
      let target = columns.indexOf(Math.min(...columns))

      let top = columns[target]
      let left = (target * details.width) + (target * details.gutter)

      element.style.position = 'absolute'
      element.style.transform = `translate3d(${ left }px, ${ top }px, 0)`

      element.setAttribute(packed, '')

      columns[target] += heights[index] + details.gutter
    })
  }

  // container helpers

  function setContainerStyles() {
    container.style.position = 'relative'
    container.style.width = `#{ details.columns * details.width + (details.column - 1) * details.gutter }px`
    container.style.height = `${ Math.max(...columns) - details.gutter }px`
  }
}

// export default (options = {}) => {
//
//   // COLUMN HELPERS
//
//   function resetColumns() {
//     columns = fillArray(getSizeDetails().columns, 0)
//   }
//
//   function fillArray(length, value) {
//     return Array.apply(null, Array(length)).map(() => value)
//   }
//
//   // SIZE HELPERS
//
//   function getSize() {
//     // find index of widest matching media query
//     return sizes
//       .map(size => size.mq && window.matchMedia(size.mq).matches)
//       .indexOf(true)
//   }
//
//   function setSize() {
//     size = getSize()
//   }
//
//   function checkSize() {
//     return size !== getSize()
//   }
//
//   function getSizeDetails() {
//     // if no media queries matched, use the base case
//     return size === -1
//       ? sizes[sizes.length - 1]
//       : sizes[size]
//   }
//
//   // API
//
//   function pack() {
//     ;[setSize, resetColumns, setElements, setContainer].forEach(func => func())
//     return instance.emit('pack')
//   }
//
//   function update() {
//     // ...
//
//     return instance.emit('update')
//   }
//
//   function resize() {
//     let ticking = false
//
//     function requestFrame() {
//       if(!ticking) {
//         requestAnimationFrame(() => update())
//         ticking = true
//       }
//     }
//
//     function update() {
//       if(checkSize()) {
//         pack()
//         instance.emit('resize')
//       }
//
//       ticking = false
//     }
//
//     window.addEventListener('resize', () => requestFrame())
//
//     return instance
//   }
// }

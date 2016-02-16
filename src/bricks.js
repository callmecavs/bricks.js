import knot from 'knot.js'

export default (options = {}) => {
  let persist       // flag signaling dynamically added elements

  let elements      // elements
  let width         // elements width
  let heights       // elements heights
  let columns       // column heights
  let size          // size index
  let details       // size details

  // options

  const container = document.querySelector(options.container)
  const packed    = options.packed.indexOf('data-') === 0 ? options.packed : `data-${ options.packed }`
  const sizes     = options.sizes.reverse()

  const selectors = {
    all:    `${ options.container } > *`,
    recent: `${ options.container } > *:not([${ packed }])`
  }

  // series

  const init = [
    setSizeIndex,
    setSizeDetails,
    resetColumns
  ]

  const run = [
    setElements,
    setElementDimensions,
    setElementStyles,
    setContainerStyles
  ]

  // instance

  const instance = knot({
    pack,
    update,
    resize
  })

  return instance

  // general helpers

  function fillArray(length, value) {
    return Array.apply(null, Array(length)).map(() => value)
  }

  function sequence(functions) {
    // run a series of functions in order
    functions.forEach(func => func())
  }

  // element helpers

  function setElements() {
    const selector = persist ? selectors.recent : selectors.all
    elements = Array.prototype.slice.call(document.querySelectorAll(selector))
  }

  function setElementDimensions() {
    width   = elements[0].clientWidth
    heights = elements.map(element => element.clientHeight)
  }

  function setElementStyles() {
    elements.forEach((element, index) => {
      let target = columns.indexOf(Math.min(...columns))

      element.style.position  = 'absolute'
      element.style.top       = `${ columns[target] }px`
      element.style.left      = `${ (target * width) + (target * details.gutter) }px`

      element.setAttribute(packed, '')

      columns[target] += heights[index] + details.gutter
    })
  }

  // container helpers

  function setContainerStyles() {
    container.style.position = 'relative'
    container.style.width    = `${ details.columns * width + (details.columns - 1) * details.gutter }px`
    container.style.height   = `${ Math.max(...columns) - details.gutter }px`
  }

  // column helpers

  function resetColumns() {
    columns = fillArray(details.columns, 0)
  }

  // size helpers

  function getSizeIndex() {
    // find index of widest matching media query
    return sizes
      .map(size => size.mq && window.matchMedia(`(min-width: ${ size.mq })`).matches)
      .indexOf(true)
  }

  function setSizeIndex() {
    size = getSizeIndex()
  }

  function setSizeDetails() {
    // if no media queries matched, use the base case
    details = size === -1
      ? sizes[sizes.length - 1]
      : sizes[size]
  }

  // API

  function pack() {
    persist = false
    sequence(init.concat(run))

    return instance.emit('pack')
  }

  function update() {
    persist = true
    sequence(run)

    return instance.emit('update')
  }

  function resize() {
    let ticking

    function requestFrame() {
      if(!ticking) {
        requestAnimationFrame(handle)
        ticking = true
      }
    }

    function handle() {
      if(size !== getSizeIndex()) {
        pack()
        instance.emit('resize', details)
      }

      ticking = false
    }

    window.addEventListener('resize', requestFrame)

    return instance
  }
}

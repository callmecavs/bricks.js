import knot from 'knot.js'

export default (options = {}) => {
  // globals

  let persist

  let sizeIndex
  let sizeDetail

  let columnHeights

  let nodes
  let nodesWidth
  let nodesHeights

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
    nodes = Array.prototype.slice.call(document.querySelectorAll(selector))
  }

  function setElementDimensions() {
    nodesWidth   = nodes[0].clientWidth
    nodesHeights = nodes.map(element => element.clientHeight)
  }

  function setElementStyles() {
    nodes.forEach((element, index) => {
      let target = columnHeights.indexOf(Math.min.apply(Math, columnHeights))

      element.style.position  = 'absolute'
      element.style.top       = `${ columnHeights[target] }px`
      element.style.left      = `${ (target * nodesWidth) + (target * sizeDetail.gutter) }px`

      element.setAttribute(packed, '')

      columnHeights[target] += nodesHeights[index] + sizeDetail.gutter
    })
  }

  // container helpers

  function setContainerStyles() {
    container.style.position = 'relative'
    container.style.width    = `${ sizeDetail.columns * nodesWidth + (sizeDetail.columns - 1) * sizeDetail.gutter }px`
    container.style.height   = `${ Math.max.apply(Math, columnHeights) - sizeDetail.gutter }px`
  }

  // column helpers

  function resetColumns() {
    columnHeights = fillArray(sizeDetail.columns, 0)
  }

  // size helpers

  function getSizeIndex() {
    // find index of widest matching media query
    return sizes
      .map(size => size.mq && window.matchMedia(`(min-width: ${ size.mq })`).matches)
      .indexOf(true)
  }

  function setSizeIndex() {
    sizeIndex = getSizeIndex()
  }

  function setSizeDetails() {
    // if no media queries matched, use the base case
    sizeDetail = sizeIndex === -1
      ? sizes[sizes.length - 1]
      : sizes[sizeIndex]
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
      if(sizeIndex !== getSizeIndex()) {
        pack()
        instance.emit('resize', sizeDetail)
      }

      ticking = false
    }

    window.addEventListener('resize', requestFrame)

    return instance
  }
}

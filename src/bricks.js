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
    pack: pack,
    update: update,
    resize: resize
  })

  return instance

  // general helpers

  function fillArray(length, value) {
    return Array.apply(null, Array(length)).map(() => value)
  }

  // element helpers

  function setElements(recent = false) {
    elements = [...document.querySelectorAll(recent ? selectors.recent : selectors.all)]
  }

  function setElementHeights() {
    heights = elements.map(element => element.clientHeight)
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
    container.style.width = `${ details.columns * details.width + (details.columns - 1) * details.gutter }px`
    container.style.height = `${ Math.max(...columns) - details.gutter }px`
  }

  // column helpers

  function resetColumns() {
    columns = fillArray(details.columns, 0)
  }

  // size helpers

  function getSizeIndex() {
    // find index of widest matching media query
    return sizes
      .map(size => size.mq && window.matchMedia(size.mq).matches)
      .indexOf(true)
  }

  function setSizeIndex() {
    size = getSizeIndex()
  }

  function checkSizeIndex() {
    return size !== getSizeIndex()
  }

  function setSizeDetails() {
    // if no media queries matched, use the base case
    details = size === -1
      ? sizes[sizes.length - 1]
      : sizes[size]
  }

  // API

  function pack() {
    const actions = [
      setSizeIndex,
      setSizeDetails,
      resetColumns,
      setElements,
      setElementHeights,
      setElementStyles,
      setContainerStyles
    ]

    actions.forEach(action => action())
    return instance.emit('pack')
  }

  function update() {
    // ...

    return instance.emit('update')
  }

  function resize() {
    let ticking

    function requestFrame() {
      if(!ticking) {
        requestAnimationFrame(() => handle())
        ticking = true
      }
    }

    function handle() {
      if(checkSizeIndex()) {
        pack()
        instance.emit('resize')
      }

      ticking = false
    }

    window.addEventListener('resize', () => requestFrame())

    return instance
  }
}

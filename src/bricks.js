import { times } from './util'

import knot from 'knot.js'

export default (options = {}) => {
  let size        // current size index
  let columns     // current columns heights

  // OPTIONS HANDLING

  const container = document.querySelector(options.container)
  const packed    = `data-${ options.packed }`
  const sizes     = options.sizes.reverse()

  const elements = {
    all:    `${ options.container } > *`,
    recent: `${ options.container } > *:not([${ packed }])`
  }

  // INSTANCE

  const instance = knot({
    pack: pack,
    update: update,
    resize: resize
  })

  return instance

  // ELEMENT HELPERS

  function getElements(recent = false) {
    return [...document.querySelectorAll(recent ? elements.recent : elements.all)]
  }

  function getHeights(elements) {
    return elements.map(element => element.clientHeight)
  }

  function setElements() {
    let elements = getElements()
    let heights = getHeights(elements)
    let details = getSizeDetails()

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

  function setContainer() {
    let details = getSizeDetails()

    container.style.position = 'relative'
    container.style.width = `${ (details.columns * details.width) + ((details.columns - 1) * details.gutter) }px`
    container.style.height = `${ Math.max(...columns) - details.gutter }px`
  }

  // COLUMN HELPERS

  function resetColumns() {
    columns = times(getSizeDetails().columns, 0)
  }

  // SIZE HELPERS

  function getSize() {
    // find index of widest matching media query
    return sizes
      .map(size => size.mq && window.matchMedia(size.mq).matches)
      .indexOf(true)
  }

  function setSize() {
    size = getSize()
  }

  function checkSize() {
    return size !== getSize()
  }

  function getSizeDetails() {
    // if no media queries matched, use the base case
    return size === -1
      ? sizes[sizes.length - 1]
      : sizes[size]
  }

  // API

  function pack() {
    ;[setSize, resetColumns, setElements, setContainer].forEach(func => func())
    return instance.emit('pack')
  }

  function update() {
    // ...

    return instance.emit('update')
  }

  function resize() {
    let timer

    function active() {
      timer !== undefined && clearTimeout(timer)
      timer = setTimeout(() => stop(), 250)
    }

    function stop() {
      checkSize() && pack()
      instance.emit('resize')
    }

    window.addEventListener('resize', () => active())

    return instance
  }
}

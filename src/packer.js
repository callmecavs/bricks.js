import { toArray, times } from './util'

export default (options = {}) => {
  // cache elements and container
  const container = document.querySelector(options.container)
  const elements = toArray(options.elements)

  // batch element height calls, to avoid forced layouts
  const elHeights = elements.map(element => element.clientHeight)

  // initialize column heights
  let colHeights = times(options.columns, 0)

  // run through the items
  elements.forEach((element, index) => {
    // find index of shortest column
    let target = colHeights.indexOf(Math.min(...colHeights))

    // apply element transform
    let top = colHeights[target]
    let left = (target * options.width) + (target * options.gutter)

    element.style.position = 'absolute'
    element.style.transform = `translate3d(${ left }px, ${ top }px, 0)`

    // update current column height
    colHeights[target] += elHeights[index] + options.gutter
  })

  // set container height
  container.style.position = 'relative'
  container.style.height = `${ Math.max(...colHeights) - options.gutter }px`
}

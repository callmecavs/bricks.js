import { toArray, times } from './util'

export default (options = {}) => {
  console.time('Masonry')

  // cache elements and container
  const container = document.querySelector(options.container)
  const elements = toArray(options.elements)

  // cache element heights
  const elHeights = elements.map(element => element.clientHeight)

  // initialize column heights
  let colHeights = times(options.columns, 0)

  // go through the items
  elements.forEach((element, index) => {
    // get shortest column index
    let target = colHeights.indexOf(Math.min(...colHeights))

    // calculate transform for current element
    let top = colHeights[target]
    let left = (target * options.width) + (target * options.gutter)

    element.style.position = 'absolute'
    element.style.transform = `translate3d(${ left }px, ${ top }px, 0)`

    // update current column height - add element height and gutter
    colHeights[target] = colHeights[target] + elHeights[index] + options.gutter
  })

  // set container height based on tallest column
  container.style.position = 'relative'
  container.style.height = `${ Math.max(...colHeights) - options.gutter }px`

  console.timeEnd('Masonry')
}

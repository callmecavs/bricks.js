const toArray = (selector) => {
  return Array.prototype.slice.call(document.querySelectorAll(selector))
}

const times = (number, result) => {
  let array = []

  for(var i = 0; i < number; i++) {
    array.push(result)
  }

  return array
}

export default (options = {}) => {
  // cache elements and container
  const container = document.querySelector(options.container)
  const elements = toArray(options.elements)

  // initialize column heights
  let heights = times(options.columns, 0)

  // go through the items
  elements.forEach(element => {
    // get height
    let elementH = element.clientHeight

    // get shortest column index
    let target = heights.indexOf(Math.min(...heights))

    // add current element to it
    let top = heights[target] === 0
      ? heights[target]
      : heights[target] + options.gutter

    let left = target === 0
      ? target * options.width
      : (target * options.width) + (target * options.gutter)

    element.style.position = 'absolute'
    element.style.transform = `translate3d(${ left }px, ${ top }px, 0)`

    // update current column width - add element height and gutter
    heights[target] = heights[target] + elementH + options.gutter
  })

  // set container height based on tallest column
  container.style.position = 'relative'
  container.style.height = `${ Math.max(...heights) }px`
}

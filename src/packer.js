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
  const container = document.querySelector(options.container)
  const elements = toArray(options.elements)

  // make the columns
  const columns = times(options.columns, document.createDocumentFragment())
  let heights = times(options.columns, 0)

  // go through the items
  elements.forEach(element => {
    // get height
    let elementH = element.clientHeight

    // figure out shortest column
    let target = heights.indexOf(Math.min(...heights))

    // add current element to shortest column

    // update current column width
    // add current element height, and gutter
    heights[target] = heights[target] + elementH + options.gutter
  })
}

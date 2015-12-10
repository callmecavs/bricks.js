export const toArray = (selector) => {
  return Array.prototype.slice.call(document.querySelectorAll(selector))
}

export const times = (number, result) => {
  let array = []

  for(var i = 0; i < number; i++) {
    array.push(result)
  }

  return array
}

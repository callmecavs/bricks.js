export const toArray = (selector) => {
  return Array.prototype.slice.call(document.querySelectorAll(selector))
}

export const random = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export const time = (run) => {
  const start = Date.now()
  run()
  const end = Date.now()

  return end - start
}

export const times = (number, func) => {
  for(var i = 0; i < number; i++) {
    func()
  }
}

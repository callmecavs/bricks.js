# Bricks.js

[![Bricks.js on NPM](https://img.shields.io/npm/v/bricks.js.svg?style=flat-square)](https://www.npmjs.com/package/bricks.js) [![Bricks.js Downloads on NPM](https://img.shields.io/npm/dm/bricks.js.svg?style=flat-square)](https://www.npmjs.com/package/bricks.js) [![Standard JavaScript Style](https://img.shields.io/badge/code_style-standard-brightgreen.svg?style=flat-square)](http://standardjs.com/)

> Momma said, "Stay patient." - Bricks, DJ Carnage

But you don't need to, because Bricks is **a blazing fast masonry layout generator for fixed width elements**.

* [Demo Page](http://callmecavs.com/bricks.js/)

## Getting Started

Follow these steps:

1. [Install](#install)
2. [Instantiate](#instantiate)
3. [Review Parameters](#parameters)
4. [Review API / Events](#api--events)
5. **[Review Example Code](https://github.com/callmecavs/bricks.js/tree/master/examples)**

## Install

Bricks was developed with a modern JavaScript workflow in mind. To use it, it's recommended you have a build system in place that can transpile ES6, and bundle modules. For a minimal boilerplate that does so, check out [outset](https://github.com/callmecavs/outset).

Using NPM, install Bricks.js, and add it to your `package.json` dependencies.

```
$ npm install bricks.js --save
```

Refer to the [releases](https://github.com/callmecavs/bricks.js/releases) page for version specific information.

## Instantiate

Simply import Bricks, then instantiate it.

It's recommended that you **assign your Bricks instance to a variable**. Using your instance, you can:

* enable and disable the resize handler
* add and remove event handlers
* accommodate dynamically added elements

```es6
// import Bricks
import Bricks from 'bricks.js'

// create an instance
const instance = Bricks({
  // ...
})
```

Parameters passed to the constructor are detailed below.

## Parameters

Note that all parameters, _except `position`_, are **required**:

* A [container](#container) (node or CSS selector)
* A [packed](#packed) attribute
* A [sizes](#sizes) array
* A [position](#position) boolean (defaulting to `true`)

### container

A node, or CSS selector, that represents the grid wrapper. The _direct children_ of this element must be the grid items.

```es6
// passing a node

const instance = Bricks({
  container: node
})

// passing a selector (document.querySelector is used to get the node)

const instance = Bricks({
  container: '.selector'
})
```

### packed

An attribute added to the grid items after they're positioned within the grid. If the attribute is not prefixed with `data-`, it will be added.

```es6
// prefixed

const instance = Bricks({
  packed: 'data-packed'
})

// unprefixed

const instance = Bricks({
  // becomes: 'data-packed'
  packed: 'packed'
})
```

Note that Bricks uses this attribute internally to avoiding unnecessarily repositioning grid items already in place. It's best to avoid manipulating it.

### sizes

An array of objects describing the grid's properties at different breakpoints.

When defining your sizes, note the following:

* Sizes must be listed **smallest to largest**
* Sizes must use **`min-width` media queries (any unit)**
* Width of the grid items at each breakpoint **should be set in your CSS (in px)**
* The size without the `mq` property is assumed to be your **smallest breakpoint, and must appear first**

```es6
// mq      - the minimum viewport width (any unit)
// columns - the number of vertical columns
// gutter  - the space (in px) between the columns and grid items

const sizes = [
  { columns: 2, gutter: 10 },
  { mq: '768px', columns: 3, gutter: 25 },
  { mq: '1024px', columns: 4, gutter: 50 }
]

const instance = Bricks({
  sizes: sizes
})
```

### position

A boolean, defaulting to `true`, indicating that the grid items should be positioned using the `top` and `left` CSS properties.

If set to `false`, the grid items will be positioned using the `transform` CSS property.

```es6
// default ('true')
// grid items are positioned via the 'top' and 'left' properties

const instance = Bricks({
  position: true
})

// explicitly 'false' (not any falsy value!)
// grid items are positioned via the 'transform' property

const instance = Bricks({
  position: false
})
```

Positioning using `transform` is done via `translate3d` for optimal performance. Coupled with a CSS `transition`, this option allows for smoothly animating the grid items into place.

## API / Events

Bricks instances are extended with [Knot.js](https://github.com/callmecavs/knot.js), a browser-based event emitter. Use the event emitter syntax to add and remove handlers for the events emitted by the API methods. Review the emitter syntax [here](https://github.com/callmecavs/knot.js#api).

Bricks exposes the following methods, and corresponding events:

* [pack](#pack)
* [update](#update)
* [resize](#resize)

Note that **all methods, including those from the event emitter, are chainable**.

### .pack()

Used to pack _all elements_ within the container.

```es6
// pack ALL grid items
instance.pack()

// 'pack' is emitted when ALL items have been packed
instance.on('pack', () => {
  // ...
})
```

Note that it should be called when creating your instance, to pack the initial items.

### .update()

Used to pack _elements without the `packed` attribute_ within the container.

```es6
// pack NEW grid items
instance.update()

// 'update' is emitted when NEW items have been packed
instance.on('update', () => {
  // ...
})
```

Note that this is the **preferred method for handling dynamically added items**, because it will only operate on items that have not yet been packed (i.e. don't have the `packed` attribute).

### .resize(flag)

Used to add or remove the `resize` event handler. It's recommended that you add the resize handler when you create your instance.

```es6
// add or remove the resize handler
instance
  .resize(true)       // 'true' adds it
  .resize(false)      // 'false' removes it

// 'resize' is emitted when resizing has resulted in a new matching 'size' object
instance.on('resize', size => {
  // 'size' is the newly matching size object
  // ...
})
```

Note that the resize handler fires the `pack` method **if the resulting screen size matches a size parameter other than the current one**. In this case, the `pack` event will be fired immediately before the `resize` event. Use the `resize` event **only for breakpoint specific code, not code meant for when the grid has been packed**.

## Browser Support

Bricks depends on the following browser APIs:

* ES5 array methods: [forEach](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach), [map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map), [indexOf](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf)
* [requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame)
* [matchMedia](https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia)

Consequently, it supports the following natively:

* Chrome 24+
* Firefox 23+
* Safari 6.1+
* Opera 15+
* IE 10+
* iOS Safari 7.1+
* Android Browser 4.4+

To support older browsers, consider including [polyfills/shims](https://github.com/Modernizr/Modernizr/wiki/HTML5-Cross-Browser-Polyfills) for the APIs listed above. There are **no plans to include any in the library**, in the interest of file size.

## Colophon

* Site Design: [Chris Allen](https://dribbble.com/cp_allen)

## License

[MIT](https://opensource.org/licenses/MIT). © 2017 Michael Cavalea

[![Built With Love](http://forthebadge.com/images/badges/built-with-love.svg)](http://forthebadge.com)

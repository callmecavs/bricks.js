# Bricks.js

[![Bricks.js on NPM](https://img.shields.io/npm/v/bricks.js.svg)](https://www.npmjs.com/package/bricks.js)

> Momma said, "Stay patient." - Bricks, DJ Carnage

But you don't need to, because Bricks is **a blazing fast masonry layout generator for fixed width elements**.

## Usage

Bricks was developed with a modern JavaScript workflow in mind. To use it, it's recommended you have a build system in place that can transpile ES6, and bundle modules. For a minimal boilerplate that does so, check out [outset](https://github.com/callmecavs/outset).

Follow these steps to get started:

* [Install](#install)
* [Instantiate](#instantiate)
  * [Parameters](#parameters)
* [Events](#events)
* [API](#api)

### Install

Using NPM, install Bricks.js, and add it to your package.json dependencies.

```
$ npm install bricks.js --save
```

### Instantiate

Simply import Bricks, then instantiate it.

It's recommended that you assign your Bricks instance to a variable. Using your instance you can enable the resize handler, bind callback handlers, and accommodate dynamically added elements.

Parameters passed to the constructor are detailed below.

```es6
// import Bricks
import bricks from 'bricks.js'

// create an instance
const masonry = bricks({
  container: '.container',
  packed: 'packed',
  sizes: [
    { columns: 2, gutter: 10 },
    { mq: '(min-width: 768px)', columns: 3, gutter: 25 },
    { mq: '(min-width: 1024px)', columns: 4, gutter: 50 }
  ]
})
```

#### Parameters

Note that **all parameters are required**:

* A [container](#container) selector
* A [packed](#packed) attribute
* A [sizes](#sizes) array

##### container

A CSS selector that matches the grid wrapper. The _direct children of this element are the grid items_.

##### packed

A data attribute added to items already positioned within the grid.

##### sizes

An array of objects describing the grid's properties at different media queries.

### Events

Bricks returns an instance that is extended with [Knot.js](https://github.com/callmecavs/knot.js), a browser-based event emitter. Using the familiar emitter syntax, it's easy to bind callbacks to the various events that Bricks emits. Those events are described below:

* `pack` - fires when
* `update` - fires when dynamically added elements have finished being positioned
* `resize` - fires when browser resizing results in the grid being repacked

### API

Review the [Knot.js](https://github.com/callmecavs/knot.js) documentation for an understanding of the emitter methods.

Note that all methods, including those from the emitter, are chainable.

#### .pack()

Note that it needs to be called after your creating your instance. Creating an instance will not automatically pack the grid items.

```es6
// create an instance, packing the initial items
const instance = bricks({
  // ...
}).pack()
```

#### .update()

Used to handle dynamically added elements. If the media query hasn't changed, `update` is the preferred method for positioning new items within the grid, because it will only operate on items without the `packed` attribute.

```es6
// using your existing instance
const instance = bricks({
  // ...
})

// call the update method
instance.update()
```

#### .resize()

Used to bind the `resize` handler to the `window` resize event. The `pack` method will only be fired on resize _if the resulting screen size matches a different size parameter than the current one_.

Note that it should only be called once, when creating your instance, to avoid event duplication, and ensure all potential resizing is handled.

```es6
// when creating your instance, call the resize method
const instance = bricks({
  // ...
}).resize()
```

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

## License

MIT. © 2016 Michael Cavalea

[![Built With Love](http://forthebadge.com/images/badges/built-with-love.svg)](http://forthebadge.com)

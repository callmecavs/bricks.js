# Bricks.js

> Momma said, "Stay patient." - Bricks, DJ Carnage

But you don't need to, because Bricks is **a blazing fast masonry layout generator for fixed width elements**.

## Usage

Bricks was developed with a modern JavaScript workflow in mind. To use it, it's recommended you have a build system in place that can transpile ES6, and bundle modules. For a minimal boilerplate that does so, check out [outset](https://github.com/callmecavs/outset).

Follow these steps to get started:

* [Install](#install)
* [Instantiate](#instantiate)
  * [Parameters](#parameters)
  * [Events](#events)

### Install

Using NPM, install Bricks.js, and add it to your package.json dependencies.

```
$ npm install bricks.js --save
```

### Instantiate

Simply import Bricks, then instantiate it.

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

It's recommended that you assign your Bricks instance to a variable. Using your instance you can enable the resize handler, bind callback handlers, and handle dynamically added elements.

Parameters passed to the constructor are detailed below.

#### Parameters

Note that each of the following parameters are **required**:

* A [container](#container)
* A [packed](#packed) attribute
* A [sizes](#sizes) array

##### container

A CSS selector that matches the grid wrapper. The direct children of this element will be assumed to be the grid items.

##### packed

A data attribute (without the `data-`) that is added to items already positioned in the grid.

##### sizes

#### Events

Bricks returns an instance that is extended with [Knot.js](https://github.com/callmecavs/knot.js), a browser-based event emitter. Using the familiar emitter syntax, it's easy to bind callbacks to the various events that Bricks emits. Those events are described below:

* `pack` - fires when
* `update` - fires when dynamically added elements have finished being positioned
* `resize` - fires when browser resizing results in the grid being repacked

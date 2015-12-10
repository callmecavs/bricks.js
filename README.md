# Bricks.js

> Momma said, "Stay patient." - Bricks, DJ Carnage

But you don't need to, because Bricks is **a blazing fast grid layout generator for fixed width elements**.

## Usage

Bricks was developed with a modern JavaScript workflow in mind. To use it, it's recommended you have a build system in place that can transpile ES6, and bundle modules. For a minimal boilerplate that does so, check out [outset](https://github.com/callmecavs/outset).

Follow these steps to get started:

* [Install](#install)
* [Call](#call)
  * [Parameters](#parameters)

### Install

Using NPM, install Bricks.js, and add it to your package.json dependencies.

```
$ npm install bricks.js --save
```

### Call

Import Bricks, then call it.

```es6
// import Bricks
import bricks from 'bricks.js'

// call Bricks
bricks('.container', '.grid-item', 4, 10, 200)
```

Explanation of each parameter follows.

#### Parameters

* `container` - A CSS selector (string) that matches the element holding the grid items.
* `elements` - A CSS selector (string) that matches the grid items.
* `columns` - Number of desired columns in the grid.
* `gutter` - Number of pixels between each column, and below each grid item.
* `width` - Width of each grid item.

# React, RxJS -> Elmish

> __Proof of Concept__ - Rxified version to better understand the [Elm Architecture](https://guide.elm-lang.org/architecture/). Don't use in production!

## Setup

```bash
npm install
npm test
npm start
```

## Flow
![Diagram](docs/diagram.png)

* [Optimistic Updates / UI](docs/optimistic-update.md)

## Introduction

* Minimal inversive - combine React-Rendering and Reactive Extentions without building a Framework with unnecessary abstractions 
* Follow the principle of "reactive" fold left with [Rx Scan Operator](http://rxmarbles.com/#scan) 

## Examples

* [Counter]()
* [Delayed Counter]()
* [Composed Compoents]()
* [Form / Validation]()
* [Random Gif]()
* [Web-Events]()

## Elmish API

**init()** function, returning the initial state (a state is an object with a required key model and an optional key cmd)

**update(model, msg)** reduce function, returns the new state

**view(model, update)** function, returns the UI (React)

**subscription(cmd, msgStream)** function, returns an stream of msgs

## Reactish API

A React component helper class.

```javascript
import { ReactComponent } from '../../lib'

export default class MyComponent extends ReactComponent {
  init() {
    return { }
  }

  update(model, msg) {
    return { model }
  }

  view(model, update) {
    return (
      <div>
      </div>
    )
  }
}
```

## Build

```bash
npm run build
```

## TODO

* HTTP subscriptions example
* Nested components


# React, RxJS -> Elmish

> __Proof of Concept__ - Rxified version to better understand the [Elm Architecture](https://guide.elm-lang.org/architecture/). Don't use in production!

## Setup

```bash
npm install
npm test
npm start
```

## Build

```bash
npm run build
```

## Flow
![Diagram](docs/diagram.png)

* [Optimistic Updates / UI](docs/optimistic-update.md)

## Introduction

* Minimal inversive - combine React-Rendering and Reactive Extentions without building a Framework with unnecessary abstractions 
* Follow the principle of "reactive" fold left with [Rx Scan Operator](http://rxmarbles.com/#scan) 

## Examples

* [All in One](https://react-elmish.linklet.run/allinone)
* [Counter](https://react-elmish.linklet.run/counter)
* [Counter delayed](https://react-elmish.linklet.run/counterdelayed)
* [Counter composed](https://react-elmish.linklet.run/countercomposed)
* [Form / Validation](https://react-elmish.linklet.run/form)
* [Interval component](https://react-elmish.linklet.run/intervalcomponent)
* [Random Gif (Fetch)](https://react-elmish.linklet.run/randomgiffetch)
* [Random Gif (Rx)](https://react-elmish.linklet.run/randomgifrx)
* [Optimistic UI](https://react-elmish.linklet.run/optimistic)
* [Web Events](https://react-elmish.linklet.run/webevents)


## Elmish API

**init()** function, returning the initial state (a state is an object with a required key model and an optional key cmd)

**update(model, msg)** reduce function, returns the new state

**view(model, update)** function, returns the updated UI (React)

**subscription(cmd, msgStream)** function, returns an stream of messages

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

## Todos

* Debounce / Throttle Example

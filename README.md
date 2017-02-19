# React + RxJS -> Elmish

> __Proof of Concept__ - [Rx(ified)](http://reactivex.io/rxjs/) and [React(ified)](https://facebook.github.io/react/docs/introducing-jsx.html) version for a better understanding of the [Elm Architecture](https://guide.elm-lang.org/architecture/). Don't use in production!

## [Live](http://reactish-elmish.services.dropstack.run)

## Setup

```bash
npm install
npm test
npm run dev
```

## Build

```bash
npm run build
```

## Deploy to [https://dropstack.run](https://dropstack.run)

```bash
npm run deploy
```

## Flow
![Diagram](docs/diagram.png)

* [Optimistic Updates / UI](docs/optimistic-update.md)

## Introduction

* Frontend-Developer friendly syntax and semantic (similar to Event/Game-Loop)
* Fits for "smart" components (side effects + state management + logic + rendering)
* Stateless React Functions for "dumb" components
* Component based state and side effect management (avoid central state)
* Minimal inversive - combine React-Rendering and Reactive Extentions without building a Framework with unnecessary abstractions
* Follow the principle of "reactive" fold left with [Rx Scan Operator](http://rxmarbles.com/#scan)
* Async/Sync side effect orchestration via [Rx-Observables](http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html)

## Examples

* [All in One](https://reactish-elmish.dropstack.run/allinone)
* [Counter](https://reactish-elmish.dropstack.run/counter)
* [Counter delayed](https://reactish-elmish.dropstack.run/counterdelayed)
* [Counter composed](https://reactish-elmish.dropstack.run/countercomposed)
* [Form / Validation](https://reactish-elmish.dropstack.run/form)
* [Interval component](https://reactish-elmish.dropstack.run/intervalcomponent)
* [Random Gif (Fetch)](https://reactish-elmish.dropstack.run/randomgiffetch)
* [Random Gif (Rx)](https://reactish-elmish.dropstack.run/randomgifrx)
* [Optimistic UI](https://reactish-elmish.dropstack.run/optimistic)
* [Web Events](https://reactish-elmish.dropstack.run/webevents)

## Elmish API

**init()** function, returning the initial state (a state is an object with a required key model and an optional key cmd)

**update(model, msg)** reduce function, returns the new state

**view(model, update)** function, returns the updated UI (React)

**subscription(cmd, msgStream)** function, manage composable side effects returns a stream of messages (Rx Observable)

## Reactish API

A React component helper class.

```javascript
import React from 'react'
import { ReactComponent } from '../../lib'

export default class MyComponent extends ReactComponent {
  // Prepare initial state
  init() {
    return {
      model: { something: 'init', }
    }
  }

  // Update state
  update(model, msg) {
    switch (msg.type) {
      case 'DO_SOMETHING':
        return {
          model: { something: 'Foo Bar', }
        }
      default:
        return {
          model
        }
    }
  }

  // Render view
  view(model, update) {
    return (
      <div>
        {JSON.stringify(model, null, 4)}
        <button onClick={() => update({type: 'DO_SOMETHING', model})}>Click</button>
      </div>
    )
  }

}
```

## Todos

* Debounce / Throttle example

# React + RxJS -> Elmish

> __Proof of Concept__ - [Rx(ified)](http://reactivex.io/rxjs/) and [React(ified)](https://facebook.github.io/react/docs/introducing-jsx.html) version for a better understanding of the [Elm Architecture](https://guide.elm-lang.org/architecture/). Don't use in production!

## [Live](https://reactish-elmish.services.dropstack.run)

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

## Introduction

* Frontend-Developer friendly syntax and semantic (similar to Event/Game-Loop)
* Fits for "smart" components (side effects + state management + logic + rendering)
* Stateless React Functions for "dumb" components
* Component based state and side effect management (avoid central state)
* Minimal inversive - combine React-Rendering and Reactive Extentions without building a Framework with unnecessary abstractions
* Follow the principle of "reactive" fold left with [Rx Scan Operator](http://rxmarbles.com/#scan)
* Async/Sync side effect orchestration via [Rx-Observables](http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html)

## Handle side-effects and compose asynchron data flows

* Reactish-Elmish manage side-effects using observable from the `subscription(...)` function
* Observables are streams of messages
* Observables are decomposable to smaller observables
* Observables are composable to larger observables
* Every observable has three different kinds of "signals" to manage the lifecycle (subscription state) of the stream
  * next - data message pushed to the stream
  * error - error message pushed to the stream (end of subscription)
  * complete - done message pushed to the stream (end of subscription)

### Creation of initial stream

* Return an observable (e.g. Rx.Observable.interval(...) in your component using the `subscription(cmd, $observable)` function
* You don't need to `subscribe()` inside of your `subscription(...)` function. Just, send a command and Reatish-Elmish will `subscribe(...)` to your created observable.
* Reactish-Elmish calls `update(message, ...)` via `$observable.do(...)` for every message pushed from the created observable

### Handle the stream lifecycle

* You get your created observable reference to the second function argument [**(message, $observable) -> $observable)**]
* Decompose to smaller data flows via observable operators like (.filter(...), .take(...), etc.)
* Compose to larger data flows via observable operators like (.merge(...), .concat(...), etc.)
* Compose with other observables to manage the subscription lifecycle using (.takeUntil(...), .takeWhile(...), etc.)

## Examples

* [All in One](http://reactish-elmish.services.dropstack.run/allinone)
* [Counter](http://reactish-elmish.services.dropstack.run/counter)
* [Counter delayed](http://reactish-elmish.services.dropstack.run/counterdelayed)
* [Counter composed](http://reactish-elmish.services.dropstack.run/countercomposed)
* [Form / Validation](http://reactish-elmish.services.dropstack.run/form)
* [Interval component](http://reactish-elmish.services.dropstack.run/intervalcomponent)
* [Interval component via functional composition](http://reactish-elmish.services.dropstack.run/intervalcomponentcompose)
* [Random Gif (Fetch)](http://reactish-elmish.services.dropstack.run/randomgiffetch)
* [Random Gif (Rx)](http://reactish-elmish.services.dropstack.run/randomgifrx)
* [Optimistic UI updates](http://reactish-elmish.services.dropstack.run/optimisticupdate)
* [Long-Running Process (aka Saga) (RxJs)](http://reactish-elmish.services.dropstack.run/ordersaga)
* [CouchDB/PouchDB change feed via AJAX long polling](http://reactish-elmish.services.dropstack.run/webevents)
* [EventSource via HTTP/2 push notifications](http://reactish-elmish.services.dropstack.run/http2eventsource)
* [Inter-component communication via global/parent state handling (aka createStore/reducer)](http://reactish-elmish.services.dropstack.run/componentcommunication)
* [Inter-component communication via streams (RxJs)](http://reactish-elmish.services.dropstack.run/componentcommunicationviastream)
* [Component composition with GraphQL data fetching (Apollo-Client)](http://reactish-elmish.services.dropstack.run/componentwithgraphql)

## Elmish API

**init(props)** function, returning the initial model (a state is an object with a required key model and an optional key cmd) [**() -> model**]

**update(model, message)** reduce function, returns the new model [**(model, message) -> model**]

**view(model, action)** function, returns the updated UI (React)  [**(model) -> html**]

**subscription(cmd, $observable)** function, manage composable side effects returns an Rx observable (stream of messages) [**(message, $observable) -> $observable)**]

## Reactish API

### Use Reactish-Elmish with functional composition (compose / withElmish)

```javascript
import React from 'react'
import Rx from 'rx'
import { compose, withElmish } from '../../lib'

// Render view
export const Interval = props => (
  <div className="widget">
    Component interval counter via functional composition: {props.model.count}
  </div>
)

const elmishInterval = withElmish({
  // Prepare initial state
  init () {
    return {
      model: {
        count: 0
      },
      // command to subscribe to side-effects (optional)
      cmd: 'INTERVAL_START'
    }
  },
  // Update state
  update (model, message) {
    model.count += 1
    return { model }
  },
  // Attach subscriptions to external side-effects
  subscriptions (cmd, $observable) {
    switch (cmd) {
      case 'INTERVAL_START':
        return Rx.Observable.interval(1000).map(x => 'INTERVAL_ELAPSED')
    }
  }
})

export default compose(elmishInterval)(Interval)
```

### Use Reactish-Elmish with class extention

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
  update(model, message) {
    switch (message.type) {
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
  view(model, action) {
    return (
      <div>
        {JSON.stringify(model, null, 4)}
        <button onClick={() => action({type: 'DO_SOMETHING', model})}>Click</button>
      </div>
    )
  }

}
```

## Testing on Component-Level

```bash
npm test
```

* [Delayed Counter Example](tests/DelayedCounter.test.js)

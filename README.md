# Elmish <- React, RxJS

> __Proof of Concept__ - Rxified version to better understand the [Elm Architecture](https://guide.elm-lang.org/architecture/). Don't use in production!

## Setup

```bash
npm install
npm start
```

## Flow
![Diagram](docs/diagram.png)

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

## Static Type Influence

* [How to using FlowType]()

## TODO

* Create "How to test?" example
* HTTP subscriptions example
import React from 'react'
import Rx from 'rx'
import { program, ReactComponent } from '../../lib'

export default class DelayedCounter extends ReactComponent {
  init() {
    return { model: 0 }
  }

  update(model, msg) {
    switch (msg) {
      case 'INCREMENTED' :
        return { model: model + 1 }
      case 'DECREMENTED' :
        return { model: model - 1 }
      case 'INCREMENT_REQUESTED' :
        return { model, cmd: 'SCHEDULE_INCREMENT' }
      case 'DECREMENT_REQUESTED' :
        return { model, cmd: 'SCHEDULE_DECREMENT' }
      default :
        return { model }
    }
  }

  view(model, update) {
    const increment = () => update('INCREMENT_REQUESTED')
    const decrement = () => update('DECREMENT_REQUESTED')
    return (
      <div>
        <p>Delayed counter: {model}</p>
        <button onClick={increment}>+1</button>
        <button onClick={decrement}>-1</button>
      </div>
    )
  }

  // runs the side effects
  subscriptions(cmd) {
    switch (cmd) {
      case 'SCHEDULE_INCREMENT' :
        return Rx.Observable.just('INCREMENTED').delay(1000)
      case 'SCHEDULE_DECREMENT' :
        return Rx.Observable.just('DECREMENTED').delay(1000)
    }
  }

}

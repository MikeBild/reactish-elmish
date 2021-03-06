import React from 'react'
import Rx from 'rx'
import { program, ReactComponent } from '../../lib'

export default class CounterDelayed extends ReactComponent {
  init() {
    return { model: 0 }
  }

  update(model, msg) {
    switch (msg) {
      case 'INCREMENTED' :
        return { model: model + 1 }
      case 'DECREMENTED' :
        return { model: model - 1 }
      case 'INCREMENT_REQUESTED':
        return { model, cmd: 'SCHEDULE_INCREMENT' }
      case 'DECREMENT_REQUESTED':
        return { model, cmd: 'SCHEDULE_DECREMENT' }
      default :
        return { model }
    }
  }

  view(model, action) {
    return (
      <div className="widget">
        <p>Delayed counter: {model}</p>
        <button onClick={() => action('INCREMENT_REQUESTED')}>+1</button>
        <button onClick={() => action('DECREMENT_REQUESTED')}>-1</button>
      </div>
    )
  }

  subscriptions(cmd) {
    switch (cmd) {
      case 'SCHEDULE_INCREMENT' :
        return Rx.Observable.return('INCREMENTED').delay(1000)
      case 'SCHEDULE_DECREMENT' :
        return Rx.Observable.return('DECREMENTED').delay(1000)
    }
  }

}

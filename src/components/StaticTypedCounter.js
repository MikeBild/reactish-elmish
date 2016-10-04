/* @flow */

import React from 'react'
import { ReactComponent } from '../../lib'

export default class Counter extends ReactComponent {
  init() {
    return { model: 0 }
  }

  update(model: number, msg: Object): Object {
    switch (msg) {
      case 'INCREMENT_REQUESTED' :
        return { model: model + 1 }
      case 'DECREMENT_REQUESTED' :
        return { model: model - 1 }
      default :
        return { model }
      }
  }

  view(model: number, update: Function): Object {
    return (
      <div>
        <p>Static Typed Counter: {model}</p>
        <button onClick={() => update('INCREMENT_REQUESTED')}>+1</button>
        <button onClick={() => update('DECREMENT_REQUESTED')}>-1</button>
      </div>
    )
  }
}

import React from 'react'
import { ReactComponent } from '../../lib'

export default class Counter extends ReactComponent {
  init() {
    return { model: this.props.count || 0 }
  }

  update(model, msg) {
    switch (msg) {
      case 'INCREMENT_REQUESTED' :
        return { model: model + 1 }
      case 'DECREMENT_REQUESTED' :
        return { model: model - 1 }
      default :
        return { model }
      }
  }

  view(model, update) {
    return (
      <div className="widget">
        <p>Counter: {model}</p>
        <button onClick={() => update('INCREMENT_REQUESTED')}>+1</button>
        <button onClick={() => update('DECREMENT_REQUESTED')}>-1</button>
      </div>
    )
  }
}

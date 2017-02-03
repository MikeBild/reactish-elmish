import React from 'react'
import Rx from 'rx'
import { program, ReactComponent } from '../../lib'

export default class Throttle extends ReactComponent {
  init() {
    return {
      model: {
        value: 'init',
      }
    }
  }

  update(model, msg) {
    switch (msg.type) {
      case 'VALUE_CHANGED':
        return { cmd: 'VALUE_CHANGED_THROTTLE', model: msg }
      case 'VALUE_THROTTLED':
        return { model }
      default :
        return { model }
    }
  }

  view(model, update) {
    return (
      <div className="widget">
        <p>{model.value}</p>
        <input type="text" placeholder="enter a value" defaultValue={model.value} onChange={e => update({type: 'VALUE_CHANGED', model: {value: e.target.value}})} />
      </div>
    )
  }

  subscriptions(cmd, msgStream) {
    switch (cmd) {
      case 'VALUE_CHANGED_THROTTLE' :
        return msgStream
          .map(x => ({type: 'VALUE_THROTTLED', model: x}))
    }
  }

}

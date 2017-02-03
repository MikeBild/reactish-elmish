import React from 'react'
import Rx from 'rx'
import { program, ReactComponent } from '../../lib'

export default class Optimistic extends ReactComponent {
  api () {
    // randomly changing success (HTTP 200) / failure (HTTP 500) result
    return fetch(`${window.__env.ENDPOINT}/timeout-example`, {
        headers: { authorization: `Bearer ${window.__env.TOKEN}`, }
      })
      .then(response => {
        if(!response.ok) return Promise.reject(new Error('Fetch error occured'))
        return response
      })
  }

  init() {
    return {
      model: {
        count: 0,
        message: '',
      },
    }
  }

  update(model, msg) {
    switch (msg.type) {
      case 'UPDATE':
        const newModel = {
          count: model.count + 1
        }
        return { model: newModel, cmd: { type: 'BEGIN_TRANSACTION', model: model } }
      case 'TRANSACTION_ROLLEDBACK':
        msg.model.message = 'Transaction rollback'
        return { model: msg.model }
      case 'END_TRANSACTION':
        model.message = 'Transaction successful'
        return { model }
      default :
        return { model }
    }
  }

  view(model, update) {
    return (
      <div className="widget">
        <p>Optimistic (update) Counter: {model.count}</p>
        <p>Transaction message: {model.message || 'none'}</p>
        <button onClick={() => update({type: 'UPDATE'})}>Update</button>
      </div>
    )
  }

  // runs side effects
  subscriptions(cmd, msgStream) {
    const rollbackStream = msgStream.filter(msg => msg.type === 'TRANSACTION_ROLLEDBACK').take(1)
    const api = this.api()
      .then(() => ({ type: 'END_TRANSACTION' }))
      .catch(() => ({ model: cmd.model, type: 'TRANSACTION_ROLLEDBACK' }))

    switch (cmd.type) {
      case 'BEGIN_TRANSACTION':
        return Rx.Observable
          .fromPromise(api)
          .takeUntil(rollbackStream)
    }
  }

}

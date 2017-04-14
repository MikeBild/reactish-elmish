import React from 'react'
import Rx from 'rx'
import { compose, withElmish } from '../../lib'

export const OptimisticUpdate = props => (
  <div className="widget">
    <p>Optimistic (update) Counter: {props.model.count}</p>
    <p>Transaction message: {props.model.message || '...'}</p>
    <button onClick={() => props.update({type: 'UPDATE'})}>Press here to initiate update command</button>
  </div>
)

const enhanceWithElmish = withElmish({
  init () {
    return {
      model: {
        count: 0,
        message: '',
      },
    }
  },
  update (model, msg) {
    switch (msg.type) {
      case 'UPDATE':
        const newModel = {
          count: model.count + 1
        }
        return { model: newModel, cmd: { type: 'BEGIN_TRANSACTION', model: model } }
      case 'TRANSACTION_ROLLEDBACK':
        msg.model.message = 'failure - transaction rollback'
        return { model: msg.model }
      case 'END_TRANSACTION':
        model.message = 'success - transaction successful'
        return { model }
      default :
        return { model }
    }
  },
  subscriptions (cmd, msgStream) {
    const rollbackStream = msgStream.filter(msg => msg.type === 'TRANSACTION_ROLLEDBACK').take(1)
    const apiResult = apiSubscription()
      .then(() => ({ type: 'END_TRANSACTION' }))
      .catch(() => ({ model: cmd.model, type: 'TRANSACTION_ROLLEDBACK' }))

    switch (cmd.type) {
      case 'BEGIN_TRANSACTION':
        return Rx.Observable
          .fromPromise(apiResult)
          .takeUntil(rollbackStream)
    }
  }
})

// randomly changing success (HTTP 200) / failure (HTTP 500) with 1s legacy result
const apiSubscription = () => {
  return fetch(`${window.__env.LAMBDA_FUNCTION_ENDPOINT}/failure-example`, {
    headers: {
      'accept': 'application/json',
      'content-type': 'application/json',
    }
  })
  .then(response => {
    if(!response.ok) return Promise.reject(new Error('Fetch error occured'))
    return response
  })
}

export default compose(enhanceWithElmish)(OptimisticUpdate)

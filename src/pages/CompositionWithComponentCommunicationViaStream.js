import React from 'react'
import Rx from 'rx'
import { compose, withElmish } from '../../lib'
import Counter from '../components/Counter'

const CompositionWithComponentCommunicationViaStream = props => (
  <div>
    <h1>Inter-component communication via streams (RxJs)</h1>
    <div className="widget">
      <Counter count={props.model.counter1} onUpdated={() => props.action({type: 'CALCULATE_COUNTER'})} />
      <Counter count={props.model.counter2} onUpdated={() => props.action({type: 'CALCULATE_COUNTER'})} />
    </div>
    <div className="widget">
      Computed (1s latency) state by parent: {props.model.computeState}
    </div>
  </div>
)

const enhanceWithElmish = withElmish({
  init() {
    return {
      model: {
        counter1: 1,
        counter2: 1,
        computeState: 0,
      },
    }
  },
  update(model, msg) {
    switch(msg.type) {
      case 'CALCULATE_COUNTER':
        return {model, cmd: 'CALCULATE_COUNTER'}
      case 'COUNTER_CALCULATED':
        return {model: {...model, computeState: model.computeState + 1}}
    }
  },
  subscriptions(cmd, msgStream) {
    switch(cmd) {
      case 'CALCULATE_COUNTER':
        return Rx.Observable.return({type: 'COUNTER_CALCULATED'}).delay(1000)
    }
  }
})

export default compose(enhanceWithElmish)(CompositionWithComponentCommunicationViaStream)

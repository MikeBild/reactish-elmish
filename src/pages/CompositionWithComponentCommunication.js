import React from 'react'
import { compose, withElmish } from '../../lib'
import Counter from '../components/Counter'

const CompositionWithComponentCommunication = props => (
  <div>
    <h1>Inter-component communication via global/parent state handling</h1>
    <div className="widget">
      <Counter count={props.model.counter1} onUpdated={state => props.action({type: 'CALCULATE_COUNTER_1', ...state})} />
      <Counter count={props.model.counter2} onUpdated={state => props.action({type: 'CALCULATE_COUNTER_2', ...state})} />
    </div>
    <div className="widget">
      Computed state by parent: {props.model.computeState}
    </div>
  </div>
)

const stateWithElmish = withElmish({
  init() {
    return {
      model: {
        counter1: 1,
        counter2: 1,
        computeState: 0,
      }
    }
  },
  update(model, msg) {
    return {
      model: {
        ...model,
        computeState: model.computeState + 1,
      }
    }
  },
})

export default compose(stateWithElmish)(CompositionWithComponentCommunication)
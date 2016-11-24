import React from 'react'
import ReactDOM from 'react-dom'
import { ReactComponent } from '../../lib'
import Counter from './Counter'

export default class CounterComposed extends ReactComponent {
  init() {
    return { 
      model: {
        counter1: 1,
        counter2: 2,
      }
    }
  }

  update(model, msg) {
    switch (msg.type) {
      case 'CALCULATE_COUNTER_1' :
        return { 
          model: {
            ...model,
            calculated1: msg.model * 2,
          }
        }
      case 'CALCULATE_COUNTER_2' :
        return { 
          model: {
            ...model,
            calculated2: msg.model * 4,
          }
        }        
      default :
        return { model }
      }
  }

  view(model, update) {
    return (
      <div className="widget">
        Composed Components and Events<br/>
        (n*2) calculated Counter 1: { model.calculated1 || 0}<br/>
        (n*4) calculated Counter 2: { model.calculated2 || 0}
        <Counter count={model.counter1} onUpdated={state => update({type: 'CALCULATE_COUNTER_1', ...state})} />
        <Counter count={model.counter2} onUpdated={state => update({type: 'CALCULATE_COUNTER_2', ...state})}/>        
      </div>
    )
  }
}

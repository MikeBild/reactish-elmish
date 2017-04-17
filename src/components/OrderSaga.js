import React from 'react'
import Rx from 'rx'
import { compose, withElmish } from '../../lib'

export const OrderSaga = props => (
  <div>
    <h1>Order-Saga (RxJS)</h1>
    <div className="widget">
      <div><strong>Saga-ID: </strong>{props.model.sagaId || '-'}</div>
      <div><strong>Saga-State: </strong>{props.model.ORDER_STATE || '-'}</div>
      <div><strong>Car: </strong>{props.model.ORDER_CAR_STATE || '-'}</div>
      <div><strong>Hotel: </strong>{props.model.ORDER_HOTEL_STATE || '-'}</div>
      <div><strong>Flight: </strong>{props.model.ORDER_FLIGHT_STATE || '-'}</div>
    </div>
    <div className="widget">
      <h4>Order-Saga idempotent action simulation</h4>
      <hr />
      <div><button onClick={() => props.action({type: 'ORDER_CAR_CONFIRM'})}>Confirm car order</button>&nbsp;<button onClick={() => props.action({type: 'ORDER_SOME_REJECT'})}>Reject car order</button></div>
      <div><button onClick={() => props.action({type: 'ORDER_HOTEL_CONFIRM'})}>Confirm hotel order</button>&nbsp;<button onClick={() => props.action({type: 'ORDER_SOME_REJECT'})}>Reject hotel order</button></div>
      <div><button onClick={() => props.action({type: 'ORDER_FLIGHT_CONFIRM'})}>Confirm flight order</button>&nbsp;<button onClick={() => props.action({type: 'ORDER_SOME_REJECT'})}>Reject flight order</button></div>
    </div>
    <div className="widget">
      <strong>Order-Saga Log</strong>
      <div>{props.model.sagaLog.map((x, i) => <pre key={i}>{JSON.stringify(x)}</pre>)}</div>
    </div>
  </div>
)

// simulation of idempotent actions for order confirm, reject, compensate
const $simulation = new Rx.Subject()
const confirmOrderCar = sagaId => $simulation.onNext({sagaId, ORDER_CAR: 'CONFIRMED', type: 'CONFIRMED'})
const confirmOrderHotel = sagaId => $simulation.onNext({sagaId, ORDER_HOTEL: 'CONFIRMED', type: 'CONFIRMED'})
const confirmOrderFlight  = sagaId => $simulation.onNext({sagaId, ORDER_FLIGHT: 'CONFIRMED', type: 'CONFIRMED'})
const rejectOrderSome  = sagaId => $simulation.onError({sagaId})
const compensateOrderCar = sagaId => Rx.Observable.return({sagaId, ORDER_CAR: 'REJECTED', type: 'COMPENSATED'}).delay(1000)
const compensateOrderHotel = sagaId => Rx.Observable.return({sagaId, ORDER_HOTEL: 'REJECTED', type: 'COMPENSATED'}).delay(1000)
const compensateOrderFlight  = sagaId => Rx.Observable.return({sagaId, ORDER_FLIGHT: 'REJECTED', type: 'COMPENSATED'}).delay(1000)

const enhanceWithElmish = withElmish({
  init () {
    return {
      cmd: {
        type: 'START',
        sagaId: 'John Doe',
      },
      model: {
        sagaLog: [],
      },
    }
  },
  update(model, msg) {
    model.sagaLog.push(msg)

    switch (msg.type) {
      case 'ORDER_CAR_CONFIRM':
        confirmOrderCar(model.sagaId)
        break
      case 'ORDER_HOTEL_CONFIRM':
        confirmOrderHotel(model.sagaId)
        break
      case 'ORDER_FLIGHT_CONFIRM':
        confirmOrderFlight(model.sagaId)
        break
      case 'ORDER_SOME_REJECT':
        rejectOrderSome(model.sagaId)
        break
      case 'ORDER_STARTED':
        model.ORDER_STATE = 'ORDER STARTED'
        break
      case 'ORDER_IN_PROGRESS':
        model.ORDER_STATE = 'ORDER IN PROGRESS (CAR | HOTEL | FLIGHT)'
        break
      case 'ORDER_SUCCESSFUL':
        model.ORDER_STATE = 'ORDER SUCCESSFUL (CAR & HOTEL & FLIGHT)'
        break
      case 'ORDER_FAILED_AND_COMPENSATED':
        model.ORDER_STATE = 'ORDER FAILED (CAR | HOTEL | FLIGHT) & ORDER COMPENSATED (CAR & HOTEL & FLIGHT)'
        break
    }
    return {
      model: {
        ...model,
        ...msg,
      },
    }
  },
  subscriptions(cmd, msgStream) {
    const $action = $simulation.delay(1000)
    const $failure = msgStream.filter(msg => msg.type === 'COMPENSATED').take(1)
    const $success = msgStream.filter(msg => msg.ORDER_CAR_STATE === 'CONFIRMED' && msg.ORDER_HOTEL_STATE === 'CONFIRMED' && msg.ORDER_FLIGHT_STATE  === 'CONFIRMED').take(1).map(x => ({...x, type: 'COMPLETE'}))
    const $compensation = Rx.Observable.merge([compensateOrderCar(cmd.sagaId), compensateOrderHotel(cmd.sagaId), compensateOrderFlight(cmd.sagaId)])

    return Rx.Observable.return(cmd)
      .merge($action)
      .catch($compensation)
      .takeUntil($failure)
      .takeUntil($success)
      .merge($success)
      .scan((state, step) => {
        state.ORDER_CAR_STATE = step.ORDER_CAR || state.ORDER_CAR_STATE
        state.ORDER_HOTEL_STATE = step.ORDER_HOTEL || state.ORDER_HOTEL_STATE
        state.ORDER_FLIGHT_STATE = step.ORDER_FLIGHT || state.ORDER_FLIGHT_STATE

        switch(step.type) {
          case 'START':
            state.type = 'ORDER_STARTED'
            break
          case 'CONFIRMED':
            state.type = 'ORDER_IN_PROGRESS'
            break
          case 'COMPLETE':
            state.type = 'ORDER_SUCCESSFUL'
            break
          case 'COMPENSATED':
            state.type = 'ORDER_FAILED_AND_COMPENSATED'
            break
        }

        return state
      }, {sagaId: cmd.sagaId})
      .map(x => ({...x}))
  },
})

export default compose(enhanceWithElmish)(OrderSaga)
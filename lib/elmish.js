import Rx from 'rx'

export function program(target) {
  const msgStream = new Rx.Subject()
  const isNotNil = x => x !== null && x !== undefined
  const update = (msg) => msgStream.onNext(msg)
  const initialState = target.init()

  // state, msg -> state
  const stateStream = msgStream
    .scan((state, msg) => target.update(state.model, msg), initialState)
    .startWith(initialState)
    .catch(msgStream)
    .shareReplay(1)

  // state -> UI
  const viewStream = stateStream
    .pluck('model')
    .map(model => target.view(model, update))
    .filter(isNotNil)
    .shareReplay(1)

  // msg, observable -> observable
  const subscriptionsStream = stateStream
    .pluck('cmd')
    .filter(isNotNil)
    .map(cmd => target.subscriptions(cmd, msgStream.asObservable())) //"read only" observable of observable projection
    .filter(isNotNil)
    .shareReplay(1)
    .mergeAll() //flatten

  // run subscriptions
  subscriptionsStream
    .delay(0) // process next messages in the next tick
    .subscribe(cmd => update(cmd))

  return {
    view: viewStream,
    update: update,
    state: stateStream,
    subscriptions: subscriptionsStream,
  }
}

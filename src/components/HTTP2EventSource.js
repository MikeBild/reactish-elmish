import React from 'react'
import Rx from 'rx'
import { compose, withElmish } from '../../lib'

export const HTTP2EventSource = props => (
  <div>
    <h1>EventSource via HTTP/2 push notifications</h1>
    <div className="widget">
      ID: {props.model.message}
    </div>
  </div>
)

const elmishHTTP2EventSource = withElmish({
  init () {
    return {model: {}, cmd: 'SUBSCRIBE'};
  },
  update (model, msg) {
    switch (msg.type) {
      case 'DOC_LOADED':
        return { model, ...msg }
      default:
        return { model, ...msg };
    }
  },
  subscriptions (cmd) {
    switch (cmd) {
      case 'SUBSCRIBE':
        return eventSourceSubscription();
    }
  }
})

const eventSourceSubscription = () => {
  const changesStream = new Rx.Subject()
  const source = new EventSource(`${window.__env.HTTP2_ENDPOINT}/event-stream`)
  source.onmessage = msg => {
    const xhr = new XMLHttpRequest()
    xhr.open('GET', `${window.__env.HTTP2_ENDPOINT}/${msg.data}`)
    xhr.responseType = 'json'
    xhr.onload = () => changesStream.onNext(xhr.response)
    xhr.send()
  }

  return changesStream
    .distinctUntilChanged()
    .map(x => ({type: 'DOC_LOADED', model: x}))
}


export default compose(elmishHTTP2EventSource)(HTTP2EventSource)

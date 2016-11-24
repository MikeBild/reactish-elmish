import React from 'react'
import Rx from 'rx'
import { ReactComponent } from '../../lib'
import config from '../../package.json'

export default class WebEvents extends ReactComponent {
  init() {
    return {model: { docs: []}, cmd: 'SUBSCRIBE'};
  }

  update (model, msg) {    
    switch (msg.type) {
      case 'DOC_LOADED':
        model.docs.push(msg.model)
        return { model }
      default:
        return { model, ...msg };    
    }
    
  }

  view (model, update) {
    return (
      <div className="widget">
        { model.docs &&
          model.docs.map((doc, i) => 
            <div key={i}>{doc._id} - {doc.dt}</div>
          )
        }
        <button onClick={() => update({cmd: 'UPSERT_DOC'})}>Change Entity</button>
      </div>
    );
  }

  subscriptions (cmd) {
    switch (cmd) {
      case 'SUBSCRIBE' :
        return this._changeFeedSubscription()
      case 'UPSERT_DOC':
        return Rx.Observable.return(this._upsert({dt: new Date().toISOString()}))
    }
  }

  _changeFeedSubscription () {
    const changesStream = new Rx.Subject()
    const xhr = new XMLHttpRequest()
    xhr.open('GET',`${config.endpoint.url}/default/_changes?feed=continuous&include_docs=true`, true)
    xhr.setRequestHeader('authorization', `Bearer ${config.endpoint.token}`)
    xhr.send('')
    xhr.onreadystatechange = () => {
      if (xhr.readyState == 3) {
        const lastLine = xhr.responseText.split('\n').filter(x => x).pop()
        changesStream.onNext(lastLine)
      }
    }

    return changesStream
      .distinctUntilChanged()
      .map(x => {
        try {
            return JSON.parse(x)
        } catch(error) {}
      })
      .filter(x => x)
      .map(x => ({type: 'DOC_LOADED', model: x.doc}))
  }

  _upsert (value) {
    console.log(value)
    return fetch(`${config.endpoint.url}/default`, {
        headers: {
          'content-type': 'application/json',
          'authorization': `Bearer ${config.endpoint.token}`,
        },
        method: 'POST',
        body: JSON.stringify(value),
      })
  }

  _get (id) {
    return fetch(`${config.endpoint.url}/default/{$id}`, {
        headers: {
          'content-type': 'application/json',
          'authorization': `Bearer ${config.endpoint.token}`,
        }
      })
  }

}
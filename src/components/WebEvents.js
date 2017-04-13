import React from 'react'
import Rx from 'rx'
import { ReactComponent } from '../../lib'

export default class WebEvents extends ReactComponent {
  init() {
    return {model: {}, cmd: 'SUBSCRIBE'};
  }

  update (model, msg) {
    switch (msg.type) {
      case 'DOC_LOADED':
        return { model, ...msg }
      default:
        return { model, ...msg };
    }
  }

  view (model, update) {
    return (
      <div>
        <h1>CouchDB/PouchDB change feed via AJAX long polling</h1>
        <div className="widget">
          ID: {model._id} - Seqence: {model.seq} - Datetime: {model.dt}&nbsp;
          <button onClick={() => update({cmd: 'UPSERT_DOC', model: model})}>Change Document</button>
        </div>
      </div>
    );
  }

  subscriptions (cmd) {
    switch (cmd) {
      case 'SUBSCRIBE':
        return this._changeFeedSubscription()
      case 'UPSERT_DOC':
        return Rx.Observable.return(this._upsert({_id: 'demo-doc', dt: new Date().toISOString()}))
    }
  }

  _changeFeedSubscription () {
    const changesStream = new Rx.Subject()

    function poll(next_seq = 0) {
      const xhr = new XMLHttpRequest()
      xhr.open('GET', `${window.__env.COUCHDB_ENDPOINT}/default/_changes?feed=longpoll&include_docs=true&since=${next_seq}`)
      xhr.withCredentials = false
      xhr.onreadystatechange = function () {
        if (xhr.readyState == 3) {
          let lastLine = xhr.responseText
          try {
              lastLine = JSON.parse(lastLine)
              next_seq = lastLine.last_seq
          } catch(error) {}
          changesStream.onNext(lastLine.results[0] || {})
          poll(next_seq)
        }
      }
      xhr.send()
    }
    poll()

    return changesStream
      .distinctUntilChanged()
      .filter(x => x)
      .filter(x => !x.deleted)
      .filter(x => x.doc.dt)
      .map(x => ({type: 'DOC_LOADED', model: {...x.doc, seq: x.seq}}))
  }

  _upsert (value) {
    return this._get(value._id)
        .then(data => ({...data, ...value}))
        .then(data => fetch(`${window.__env.COUCHDB_ENDPOINT}/default/${value._id}`, {
        headers: {
          'accept': 'application/json',
          'content-type': 'application/json',
        },
        method: 'PUT',
        body: JSON.stringify(data),
      }))
  }

  _get (id) {
    return fetch(`${window.__env.COUCHDB_ENDPOINT}/default/${id}`, {
        headers: {
          'accept': 'application/json',
          'content-type': 'application/json',
        },
      })
      .then(x => x.json())
  }
}

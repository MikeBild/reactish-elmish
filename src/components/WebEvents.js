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
      <div className="widget">
        {model._id} - {model.dt}&nbsp;
        <button onClick={() => update({cmd: 'UPSERT_DOC', model: model})}>Change Document</button>
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

/*
curl -H "authorization: Bearer eyJhbGciOiJIUzI1NiIsImF1ZGllbmNlIjoibGlua2xldCJ9.eyJ1c2VyIjoiYWRtaW4iLCJyb2xlIjoiYWRtaW4ifQ.7T1c08mDJ-W3fGOQbgkVAoXvranJndViGmo94tumXP4" \
  https://bbaabb.linklet.run/default/_changes?feed=continuous&include_docs=true

curl -H "authorization: Bearer eyJhbGciOiJIUzI1NiIsImF1ZGllbmNlIjoibGlua2xldCJ9.eyJ1c2VyIjoiYWRtaW4iLCJyb2xlIjoiYWRtaW4ifQ.7T1c08mDJ-W3fGOQbgkVAoXvranJndViGmo94tumXP4" \
  https://bbaabb.linklet.run/default/_all_docs
*/

    const changesStream = new Rx.Subject()
    const xhr = new XMLHttpRequest()
    xhr.open('GET',`${window.__env.ENDPOINT}/default/_changes?feed=continuous&include_docs=true`, true)
    xhr.setRequestHeader('authorization', `Bearer ${window.__env.TOKEN}`)
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
      .filter(x => !x.deleted)
      .filter(x => x.doc.dt)
      .map(x => ({type: 'DOC_LOADED', model: x.doc}))
  }

  _upsert (value) {
    return this._get(value._id)
        .then(data => ({...data, ...value}))
        .then(data => fetch(`${window.__env.ENDPOINT}/default/${value._id}`, {
        headers: {
          'content-type': 'application/json',
          'authorization': `Bearer ${window.__env.TOKEN}`,
        },
        method: 'PUT',
        body: JSON.stringify(data),
      }))
  }

  _get (id) {
    return fetch(`${window.__env.ENDPOINT}/default/${id}`, {
        headers: {
          'content-type': 'application/json',
          'authorization': `Bearer ${window.__env.TOKEN}`,
        }
      })
      .then(x => x.json())
  }

}

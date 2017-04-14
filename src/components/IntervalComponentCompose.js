import React from 'react'
import Rx from 'rx'
import { compose, withElmish } from '../../lib'

export const IntervalComponentCompose = props => (
  <div className="widget">
    Component interval counter via functional composition: {props.model.count}
  </div>
)

const enhanceWithElmish = withElmish({
  init () {
    return {
      model: {
        count: 0
      },
      cmd: 'INTERVAL_START'
    }
  },
  update (model, msg) {
    model.count += 1
    return { model }
  },
  subscriptions (cmd) {
    switch (cmd) {
      case 'INTERVAL_START':
        return Rx.Observable.interval(1000).map(x => 'INTERVAL_ELAPSED')
    }
  }
})

export default compose(enhanceWithElmish)(IntervalComponentCompose)

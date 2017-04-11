import React from 'react'
import Rx from 'rx'
import { program, ReactComponent } from '../../lib'

export default class Interval extends ReactComponent {

  init() {
    return {model: {count: 0}, cmd: 'INTERVAL_START'};
  }

  update(model, msg) {
    model.count += 1;
    return { model };
  }

  view(model) {
    return model;
  }

  subscriptions(cmd) {
    switch (cmd) {
      case 'INTERVAL_START' :
        return Rx.Observable.interval(1000).map(x => 'INTERVAL_ELAPSED');
    }
  }
}

import React from 'react'
import ReactDOM from 'react-dom'
import { program } from '../lib'
import Counter from './components/Counter'
import DelayedCounter from './components/DelayedCounter'
import StaticTypedCounter from './components/StaticTypedCounter'
import Interval from './components/Interval'
import Optimistic from './components/Optimistic'
import './style.css'

export default class Root extends React.Component {
  interval = new Interval()

  state = {
    count: 0
  }

  componentDidMount() {
    this.interval.program.view
      .do(x => this.setState({count: x.count}))
      .subscribe()
  }

  render () {
    return (
      <div>
        <h1 className="text-center">React, RxJS -> Elmish</h1>
        <div className="widget">
          Interval counter: {this.state.count}
        </div>
        <Counter />
        <DelayedCounter />
        <StaticTypedCounter />
        <Optimistic />
      </div>
    )
  }
}

ReactDOM.render(<Root />, document.getElementById('root'))

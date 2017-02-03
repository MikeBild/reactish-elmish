import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, browserHistory, Link } from 'react-router'
import { program } from '../lib'
import Counter from './components/Counter'
import CounterDelayed from './components/CounterDelayed'
import Interval from './components/Interval'
import IntervalComponent from './components/IntervalComponent'
import Optimistic from './components/Optimistic'
import CounterComposed from './components/CounterComposed'
import RandomGifFetch from './components/RandomGifFetch'
import RandomGifRx from './components/RandomGifRx'
import WebEvents from './components/WebEvents'
import Form from './components/Form'
import Dump from './components/Dump'
import Throttle from './components/Throttle'
import './style.css'

export default class AllInOne extends React.Component {
  interval = new Interval()

  state = {
    count: 0
  }

  componentDidMount() {
    this.intervalSubscription = this.interval.program.view
                                    .do(x => this.setState({count: x.count}))
                                    .subscribe()
  }

  componentWillUnmount() {
    this.intervalSubscription.dispose()
  }

  render () {
    return (
      <div>
        <h1 className="text-center">React + RxJS -> Elmish</h1>
        <Counter count={6} />
        <CounterDelayed />
        <CounterComposed />
        <Form />
        <IntervalComponent />
        <div className="widget">
          State Interval counter: {this.state.count}
        </div>
        <RandomGifFetch />
        <RandomGifRx />
        <Optimistic />
        <WebEvents />
      </div>
    )
  }
}

const Navigation = () => {
  return (
    <div>
      <h1 className="text-center">React + RxJS -> Elmish</h1>
      <ul>
        <li><Link to="/allinone">All in One</Link></li>
        <li><Link to="/counter">Counter</Link></li>
        <li><Link to="/counterdelayed">Counter delayed</Link></li>
        <li><Link to="/countercomposed">Counter composed</Link></li>
        <li><Link to="/form">Form / Validation</Link></li>
        <li><Link to="/intervalcomponent">Interval component</Link></li>
        <li><Link to="/randomgiffetch">Random Gif (Fetch)</Link></li>
        <li><Link to="/randomgifrx">Random Gif (Rx)</Link></li>
        <li><Link to="/optimistic">Optimistic UI</Link></li>
        <li><Link to="/webevents">Web Events</Link></li>
        <li><Link to="/throttle">Throttle</Link></li>
      </ul>
    </div>
  )
}

ReactDOM.render(
  <Router history={browserHistory}>
    <Route path="/" component={Navigation} />
    <Route path="/allinone" component={AllInOne} />
    <Route path="/counter" component={Counter} />
    <Route path="/counterdelayed" component={CounterDelayed} />
    <Route path="/countercomposed" component={CounterComposed} />
    <Route path="/form" component={Form} />
    <Route path="/intervalcomponent" component={IntervalComponent} />
    <Route path="/randomgiffetch" component={RandomGifFetch} />
    <Route path="/randomgifrx" component={RandomGifRx} />
    <Route path="/optimistic" component={Optimistic} />
    <Route path="/webevents" component={WebEvents} />
    <Route path="/throttle" component={Throttle} />
  </Router>,
  document.getElementById('root'))

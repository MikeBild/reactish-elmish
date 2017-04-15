import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, browserHistory, Link } from 'react-router'
import Counter from './components/Counter'
import CounterDelayed from './components/CounterDelayed'
import Interval from './components/Interval'
import IntervalComponent from './components/IntervalComponent'
import IntervalComponentCompose from './components/IntervalComponentCompose'
import OptimisticUpdate from './components/OptimisticUpdate'
import CounterComposed from './components/CounterComposed'
import RandomGifFetch from './components/RandomGifFetch'
import RandomGifRx from './components/RandomGifRx'
import ChangeFeed from './components/ChangeFeed'
import HTTP2EventSource from './components/HTTP2EventSource'
import Form from './components/Form'
import Dump from './components/Dump'
import CompositionWithComponentCommunication from './pages/CompositionWithComponentCommunication'
import Throttle from './components/Throttle'
import './style.css'

export default class AllInOne extends React.Component {
  interval = new Interval()

  state = {
    count: 0
  }

  componentDidMount() {
    this.intervalSubscription = this.interval.program.view.do(x => this.setState({count: x.count})).subscribe()
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
        <IntervalComponentCompose />
        <div className="widget">
          State Interval counter: {this.state.count}
        </div>
        <RandomGifFetch />
        <RandomGifRx />
        <OptimisticUpdate />
        <ChangeFeed />
        <HTTP2EventSource />
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
        <li><Link to="/intervalcomponentcompose">Interval component via functional composition</Link></li>
        <li><Link to="/randomgiffetch">Random Gif (Fetch)</Link></li>
        <li><Link to="/randomgifrx">Random Gif (Rx)</Link></li>
        <li><Link to="/optimisticupdate">Optimistic update UI</Link></li>
        <li><Link to="/changefeed">CouchDB/PouchDB change feed via AJAX long polling</Link></li>
        <li><Link to="/http2eventsource">EventSource via HTTP/2 push notifications</Link></li>
        <li><Link to="/componentcommunication">(Global) state handling for inter-component communication</Link></li>
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
    <Route path="/intervalcomponentcompose" component={IntervalComponentCompose} />
    <Route path="/randomgiffetch" component={RandomGifFetch} />
    <Route path="/randomgifrx" component={RandomGifRx} />
    <Route path="/optimisticupdate" component={OptimisticUpdate} />
    <Route path="/changefeed" component={ChangeFeed} />
    <Route path="/http2eventsource" component={HTTP2EventSource} />
    <Route path="/componentcommunication" component={CompositionWithComponentCommunication} />
    <Route path="/throttle" component={Throttle} />
  </Router>,
  document.getElementById('root'))

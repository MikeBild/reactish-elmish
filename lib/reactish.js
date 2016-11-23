import React from 'react'
import { program } from './elmish'

export default class ReactComponent extends React.Component {
  program = program(this)

  state = {
    view: this.view(this.init().model, this.program.update)
  }

  componentDidMount() {    
    this.viewSubscription = this.program.view.subscribe(view => this.setState({ view })) 
    this.stateSubscription = this.program.state.do(state => this.props.onUpdated && this.props.onUpdated(state)).subscribe()
  }

  componentWillUnmount() {
    this.viewSubscription.unsubscribe()
    this.stateSubscription.unsubscribe()
  }

  render() {
    return this.state.view
  }
}

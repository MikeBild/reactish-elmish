import React from 'react'
import { program } from './elmish'

export default class ReactComponent extends React.Component {
  program = program(this)

  state = {
    view: this.view(this.init().model, this.program.update)
  }

  componentDidMount() {
    this.subscription = this.program.view.subscribe(view => this.setState({ view }))
  }

  componentWillUnmount() {
    this.subscription.unsubscribe()
  }

  render() {
    return this.state.view
  }
}

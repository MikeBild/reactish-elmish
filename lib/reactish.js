import React from 'react'
import { program } from './elmish'

export class ReactComponent extends React.Component {
  program = program(this)

  state = {
    view: this.view(this.init().model, this.program.update)
  }

  componentDidMount () {
    this.viewSubscription = this.program.view.subscribe(view => this.setState({ view }))
    this.stateSubscription = this.program.state.do(state => this.props.onUpdated && this.props.onUpdated(state)).subscribe()
  }

  componentWillUnmount () {
    this.viewSubscription.dispose()
    this.stateSubscription.dispose()
  }

  render () {
    return this.state.view
  }
}

export const withElmish = ({init, update, subscriptions}) => {
  return BaseComponent => {
    return class extends ReactComponent {
      init () {
        return init && init() || {model: {}, cmd: undefined}
      }
      update (model, msg) {
        return update && update(model, msg) || {model: {}}
      }
      subscriptions(cmd, msgStream) {
        return this.$subscription = subscriptions && subscriptions(cmd, msgStream)
      }
      view (model, update) {
        return BaseComponent({...this.props, model, update, subscription: this.$subscription, action: update})
      }
    }
  }
}

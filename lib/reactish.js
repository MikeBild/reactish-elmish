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
        return init && init(this.props) || {model: {...this.props}, cmd: undefined}
      }
      update (model, msg) {
        return update && update(model, msg) || {model: {...this.props}}
      }
      subscriptions(cmd, msgStream) {
        return subscriptions && subscriptions(cmd, msgStream)
      }
      view (model, update) {
        const props = {...this.props, model, update, action: update};
        return <BaseComponent {...props} />
      }
    }
  }
}

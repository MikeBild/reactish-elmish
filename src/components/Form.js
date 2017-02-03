import React from 'react'
import { ReactComponent } from '../../lib'

export default class Form extends ReactComponent {
  init() {
    return {
      model: {
        firstname: 'John',
        lastname: 'Doe',
        errors: {},
      }
    }
  }

  update(model, msg) {
    switch (msg.type) {
      case 'LASTNAME_CHANGED':
        model.errors['lastname'] = !msg.model.lastname ? 'Last name can not be empty' : ''
        return {
          model: {
            ...model,
            ...msg.model,
          }
        }
      case 'FIRSTNAME_CHANGED':
        model.errors['firstname'] = !msg.model.firstname ? 'First name can not be empty' : ''
        return {
          model: {
            ...model,
            ...msg.model,
          }
        }
      default :
        return { model }
      }
  }

  view(model, action) {
    return (
      <div className="widget">
        <label>Entered first name: </label>{model.firstname}<br/>
        <label>Entered last name: </label>{model.lastname}<br/>
        { Object.keys(model.errors).map((field, i) =>
            <div key={i}>{model.errors[field]}</div>
          )
        }
        <input type="text" placeholder="first name" defaultValue={model.firstname} onChange={e => action({type: 'FIRSTNAME_CHANGED', model: {firstname: e.target.value}})} />
        <input type="text" placeholder="last name" defaultValue={model.lastname} onChange={e => action({type: 'LASTNAME_CHANGED', model: {lastname: e.target.value}})} />
      </div>
    )
  }
}

import React from 'react'
import'rx-dom'
import { ReactComponent } from '../../lib'

export default class RandomGif extends ReactComponent {
  init() {
    return {
      cmd: 'LOAD_RANDOM_GIF',
      model: {
        gifUrl: '',
        error: '',
      },
    };
  }

  update(model, msg) {    
    switch (msg.type) {
      case 'RANDOM_GIF_LOADED':      
        return { 
          model: {
            ...model,
            gifUrl: msg.gifUrl,
            error: msg.error,
          }
        }
      default :
        return { ...msg, ...model }
    }
  }

  view(model, update) {    
    return (
      <div className="widget">
        {model.error ? <span>Error/Not Found</span> : this._viewImage(model.gifUrl)}
        <br />
        {!model.gifUrl && model.error ? <span>Try later</span> : <button onClick={() => update({cmd: 'LOAD_RANDOM_GIF', model: {}}) }>More</button>}
      </div>
    )
  }

  subscriptions(cmd) {

    switch (cmd) {
      case 'LOAD_RANDOM_GIF' :
        return this._getRandomGif()
          .catch(error => Rx.Observable.return({error: error.message}))
          .map(data => ({
            type:'RANDOM_GIF_LOADED',
            gifUrl: data.error ? '' : data,
            error:  data.error
          }))
    }
  }

  _viewImage(url){
    return url ? <img src={url} style={{maxHeight:'200px', maxWidth:'200px'}} /> : <p>Loading&hellip;</p>
  }

  _getRandomGif () {
    return Rx.DOM.ajax({
      url: `//api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag=funny dogs`,
      responseType: 'json',
      crossDomain: true,
      createXHR: () => new XMLHttpRequest(),
    })
    .map(loader => loader.response.data.image_url)
  }  
}
/**
 * Imports
 */

import domready from '@f/domready'
import vdux from 'vdux/dom'
import reducer from './reducer'
import location from 'redux-effects-location'
import effects from 'redux-effects'
import flow from 'redux-flo'

var app = require('./app').default

const initialState = {
  url: '/',
  levelSize: [12, 12],
  painted: [],
  turtles: {
    1: {
      location: [11, 0],
      dir: 0
    }
  }
}

const config = {
  apiKey: 'AIzaSyA1Ib5i5HZPCxnKp4ITiUoy5VEKaLMdsDY',
  authDomain: 'play-ev3.firebaseapp.com',
  databaseURL: 'https://play-ev3.firebaseio.com',
  storageBucket: 'play-ev3.appspot.com'
}
/**
 * App
 */

const {subscribe, render, replaceReducer} = vdux({
  reducer,
  initialState,
  middleware: [
    flow(),
    effects,
    location(),
  ]
})

domready(() => {
  subscribe((state) => {
    render(app(state))
  })
})

if (module.hot) {
  module.hot.accept(['./app', './reducer'], () => {
    replaceReducer(require('./reducer').default)
    app = require('./app').default
  })
}

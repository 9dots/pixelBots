/**
 * Imports
 */

import domready from '@f/domready'
import vdux from 'vdux/dom'
import reducer from './reducer'
import location from 'redux-effects-location'
import effects from 'redux-effects'
import flow from 'redux-flo'
import codeRunner from './middleware/codeRunner'
import theme from './theme'
import scroll from './middleware/scroll'
import addCode from './middleware/addCodeMW'
import rootEpic from './epics'
import {createEpicMiddleware} from 'redux-observable'

var app = require('./app').default
const epicMiddleware = createEpicMiddleware(rootEpic)

const palette = [
  'lightblue',
  'green',
  'red',
  'brown',
  'black'
]

const initialState = {
  url: '/',
  levelSize: [5, 5],
  painted: [],
  initialPainted: [],
  active: 1,
  inputType: 'code',
  selectedLine: 0,
  animals: {
    1: {
      initial: {
        location: [4, 0],
        dir: 0,
        rot: 0
      },
      type: 'zebra',
      current: {},
      sequence: []
    }
  }
}

// const config = {
//   apiKey: 'AIzaSyA1Ib5i5HZPCxnKp4ITiUoy5VEKaLMdsDY',
//   authDomain: 'play-ev3.firebaseapp.com',
//   databaseURL: 'https://play-ev3.firebaseio.com',
//   storageBucket: 'play-ev3.appspot.com'
// }
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
    codeRunner(),
    epicMiddleware,
    scroll,
    addCode
  ]
})

domready(() => {
  subscribe((state) => {
    render(app(state), {uiTheme: theme, palette})
  })
})

if (module.hot) {
  module.hot.accept(['./app', './reducer'], () => {
    replaceReducer(require('./reducer').default)
    app = require('./app').default
  })
}

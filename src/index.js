/**
 * Imports
 */

import {createEpicMiddleware} from 'redux-observable'
import handleError from './middleware/handleError'
import codeRunner from './middleware/codeRunner'
import moveAnimal from './middleware/moveAnimal'
import location from 'redux-effects-location'
import addCode from './middleware/addCodeMW'
import scroll from './middleware/scroll'
import effects from 'redux-effects'
import domready from '@f/domready'
import reducer from './reducer'
import rootEpic from './epics'
import flow from 'redux-flo'
import vdux from 'vdux/dom'
import theme from './theme'

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
    moveAnimal(),
    handleError(),
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

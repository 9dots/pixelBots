/**
 * Imports
 */

import {createEpicMiddleware} from 'redux-observable'
import handleError from './middleware/handleError'
import paintSquare from './middleware/paintSquare'
import removeBlock from './middleware/removeBlock'
import codeRunner from './middleware/codeRunner'
import moveAnimal from './middleware/moveAnimal'
import location from 'redux-effects-location'
import firebaseConfig from './firebaseConfig'
import addCode from './middleware/addCodeMW'
import scroll from './middleware/scroll'
import effects from 'redux-effects'
import domready from '@f/domready'
import reducer from './reducer'
import {initGame} from './utils'
import rootEpic from './epics'
import flow from 'redux-flo'
import * as fire from 'vdux-fire'
import vdux from 'vdux/dom'
import theme from './theme'

const epicMiddleware = createEpicMiddleware(rootEpic)
var app = require('./app').default

const initialState = {
  url: '/',
  active: 0,
  selectedLine: 0,
  game: initGame()
}

const {subscribe, render, replaceReducer} = vdux({
  reducer,
  initialState,
  middleware: [
    flow(),
    effects,
    location(),
    codeRunner(),
    moveAnimal(),
    paintSquare(),
    handleError(),
    fire.middleware(firebaseConfig),
    epicMiddleware,
    scroll,
    addCode,
    removeBlock
  ]
})

domready(() => {
  subscribe((state) => {
    return render(app(state), {uiTheme: theme})
  })
})

if (module.hot) {
  module.hot.accept(['./app', './reducer'], () => {
    replaceReducer(require('./reducer').default)
    app = require('./app').default
  })
}

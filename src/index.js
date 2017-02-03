/**
 * Imports
 */

import checkCompleted from './middleware/checkCompleted'
import handleError from './middleware/handleError'
import paintSquare from './middleware/paintSquare'
import removeBlock from './middleware/removeBlock'
import codeRunner from './middleware/codeRunner'
import moveAnimal from './middleware/moveAnimal'
import location from 'redux-effects-location'
import firebaseConfig from './firebaseConfig'
import localstorage from 'redux-effects-localstorage'
import addCode from './middleware/addCodeMW'
import saveCode from './middleware/saveCode'
import scroll from './middleware/scroll'
import auth from './middleware/auth'
import effects from 'redux-effects'
import domready from '@f/domready'
import reducer from './reducer'
import firebase from 'firebase'
import {initGame} from './utils'
import flow from 'redux-flo'
import * as fire from 'vdux-fire'
import vdux from 'vdux/dom'
import theme from './theme'

firebase.initializeApp(firebaseConfig)

var app = require('./app').default

const initialState = {
  url: '',
  toast: '',
  active: 0,
  speed: 1,
  user: {},
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
    localstorage(),
    codeRunner(),
    moveAnimal(),
    paintSquare(),
    handleError(),
    fire.middleware(firebaseConfig),
    auth,
    checkCompleted,
    scroll,
    addCode,
    saveCode,
    removeBlock
  ]
})

domready(() => {
  subscribe((state) => {
    return render(app(state), {uiTheme: theme, currentUser: state.user, username: state.username, profile: state.profile})
  })
})

if (module.hot) {
  module.hot.accept(['./app', './reducer'], () => {
    replaceReducer(require('./reducer').default)
    app = require('./app').default
  })
}

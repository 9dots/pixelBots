/**
 * Imports
 */

import 'regenerator-runtime/runtime'

import checkCompleted from './middleware/checkCompleted'
import localstorage from 'redux-effects-localstorage'
import handleError from './middleware/handleError'
import paintSquare from './middleware/paintSquare'
import removeBlock from './middleware/removeBlock'
import moveAnimal from './middleware/moveAnimal'
import codeRunner from './middleware/codeRunner'
import location from 'redux-effects-location'
import firebaseConfig from './firebaseConfig'
import addCode from './middleware/addCodeMW'
import saveCode from './middleware/saveCode'
import scroll from './middleware/scroll'
import auth from './middleware/auth'
import effects from 'redux-effects'
import domready from '@f/domready'
import * as fire from 'vdux-fire'
import {initGame} from './utils'
import reducer from './reducer'
import firebase from 'firebase'
import flow from 'redux-flo'
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
  title: 'pixelBots',
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
    moveAnimal(),
    paintSquare(),
    handleError(),
    fire.middleware(firebaseConfig),
    auth,
    codeRunner(),
    checkCompleted,
    scroll,
    addCode,
    saveCode,
    removeBlock
  ]
})

domready(() => {
  subscribe((state) => {
    return render(app(state), {
      uiTheme: theme,
      uid: state.user,
      username: state.username,
      profile: state.profile,
      title: state.title,
      inProgress: state.profile && state.profile.inProgress
    })
  })
})

if (module.hot) {
  module.hot.accept(['./app', './reducer'], () => {
    replaceReducer(require('./reducer').default)
    app = require('./app').default
  })
}

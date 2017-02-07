/** @jsx element */

import location, {bindUrl} from 'redux-effects-location'
import firebaseConfig from './firebaseConfig'
import {component, element} from 'vdux'
import auth from './middleware/auth'
import logger from 'redux-logger'
import * as fire from 'vdux-fire'

export default component({
  getContext ({state}) {
    return {
      url: state.url,
      uid: state.uid,
      username: state.username
    }
  },

  initialState: {
    url: ''
  },

  onCreate ({actions}) {
    return actions.initializeApp
  },

  render () {
    return (
      <div> Hello vdux 4 </div>
    )
  },

  middleware: [
    location(),
    logger(),
    fire.middleware(firebaseConfig),
    auth
  ],

  controller: {
    * initializeApp ({actions}) {
      yield bindUrl((url) => actions.updateUrl(url))
    }
  },

  reducer: {
    updateUrl: (state, url) => ({...state, url}),
    setUserId: (state, uid) => ({...state, uid}),
    setUsername: (state, username) => ({...state, username})
  }
})

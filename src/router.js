/** @jsx element */

import element from 'vdux/element'
import Window from 'vdux/window'
import Document from 'vdux/document'
import HomePage from './pages/Home'
import enroute from 'enroute'
import {setUrl} from 'redux-effects-location'
import {isLocal} from './utils'

function initialState () {
  return {
    url: '/'
  }
}

function render ({local, props}) {
  const router = enroute({
    '*': () => <HomePage {...props} />
  })

  return (
    <Window onPopstate={local(setUrl)}>
      <Document onClick={handleLinkClicks(local(setUrl))}>
        {
          router(props.url)
        }
      </Document>
    </Window>
  )
}

function handleLinkClicks (setUrl) {
  return (e) => {
    if (e.target.nodeName === 'A') {
      const href = e.getAttribute('href')
      if (isLocal(href)) {
        e.preventDefault()
        return setUrl(href)
      }
    }
  }
}

function reducer (state, action) {
  switch (action.type) {
    case setUrl.type:
      return {
        ...state,
        url: action.payload
      }
  }
  return state
}

export default {
  initialState,
  reducer,
  render
}

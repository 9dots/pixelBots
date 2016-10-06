/** @jsx element */

import {setUrl} from 'redux-effects-location'
import Header from './components/Header'
import Button from './components/Button'
import {initializeApp} from './actions'
import Create from './pages/Create'
import HomePage from './pages/Home'
import element from 'vdux/element'
import enroute from 'enroute'
import {Block} from 'vdux-ui'
import Game from './pages/Game'
import {firebaseSet} from 'vdux-fire'

const router = enroute({
  '/': (params, props) => <HomePage top='60px' {...props} />,
  '/play/:gameID': (params, props) => <Game {...props} gameID={params.gameID}/>,
  '/:gameID/create/:slug': ({slug, gameID}, props) => <Create top='60px' gameID={gameID} params={slug} {...props} />
})

function onCreate () {
  return initializeApp()
}

function render ({local, props}) {
  return (
    <Block tall wide>
      <Header h='60px' absolute top='0' left='0' right='0' title='Pixel Bots'>
        {props.url === '/' && (
          <Button onClick={setId}>Create</Button>
        )}
      </Header>
      {
        router(props.url, props)
      }
    </Block>
  )
}

function * setId () {
  const id = yield firebaseSet({method: 'push', ref: 'games', value: '1234'})
  yield setUrl(`/${id}/create/animal`)
}

export default {
  onCreate,
  render
}

/** @jsx element */

import {initializeApp, createNew, refresh, saveProgress} from './actions'
import HeaderElement from './components/HeaderElement'
import ModalMessage from './components/ModalMessage'
import CreateSandbox from './pages/CreateSandbox'
import {setUrl} from 'redux-effects-location'
import {Block, Icon, Text} from 'vdux-ui'
import Header from './components/Header'
import Create from './pages/Create'
import HomePage from './pages/Home'
import element from 'vdux/element'
import Game from './pages/Game'
import enroute from 'enroute'

let gameID
let saveID

const router = enroute({
  '/play/:gameID': (params, props) => {
    gameID = params.gameID
    return <Game key={params.gameID} {...props} left='60px' gameID={params.gameID}/>
  },
  '/saved/:saveID': (params, props) => {
    saveID = params.saveID
    return <Game key={params.gameID} {...props} left='60px' gameID={params.gameID} saveID={saveID}/>
  },
  '/:gameID/create/:slug': ({slug, gameID}, props) => (
    <Create left='60px' gameID={gameID} params={slug} {...props} />
  ),
  '/': homePage
})

function homePage (params, props) {
  return <HomePage left='60px' {...props} />
}

function onCreate () {
  return initializeApp()
}

function render ({props}) {
  const {message, url, game} = props
  const {animals} = game

  return (
    <Block tall wide>
      <Header w='60px' bgColor='primary' top='0' left='0'>
        <HeaderElement background='url(/animalImages/zebra.jpg)' handleClick={[() => setUrl('/'), refresh]} text='Pixel Bots'/>
        <HeaderElement handleClick={createNew} text='Challenge' icon='note_add'/>
        {url.search(/\/(play|saved)\//gi) > -1 && <HeaderElement
          handleClick={() => saveProgress(animals, gameID, saveID)}
          absolute
          bottom='10px'
          text='Save'
          icon='save'/>}
      </Header>
      {
        router(url, props)
      }
      {message && <ModalMessage
        header={message.header}
        body={message.body}/>
      }
    </Block>
  )
}

export default {
  onCreate,
  render
}

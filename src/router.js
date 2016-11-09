/** @jsx element */

import {initializeApp, createNew, refresh, saveProgress, setToast} from './actions'
import HeaderElement from './components/HeaderElement'
import ModalMessage from './components/ModalMessage'
import CreateSandbox from './pages/CreateSandbox'
import {Block, Icon, Text, Toast} from 'vdux-ui'
import {setUrl} from 'redux-effects-location'
import Transition from 'vdux-transition'
import Header from './components/Header'
import Create from './pages/Create'
import HomePage from './pages/Home'
import element from 'vdux/element'
import Game from './pages/Game'
import enroute from 'enroute'

const router = enroute({
  '/play/:gameID': (params, props) => {
    return <Game key={params.gameID} {...props} left='60px' gameID={params.gameID}/>
  },
  '/saved/:saveID': (params, props) => {
    return <Game key={params.gameID} {...props} left='60px' gameID={params.gameID} saveID={params.saveID}/>
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
  const {message, url, game, saveID, gameID, toast} = props
  const {animals} = game

  return (
    <Block tall wide>
      <Header w='60px' bgColor='primary' top='0' left='0'>
        <HeaderElement background='url(/animalImages/zebra.jpg)' handleClick={[() => setUrl('/'), refresh]} text='Pixel Bots'/>
        <HeaderElement handleClick={createNew} text='Challenge' icon='note_add'/>
        {url.search(/\/(play|saved)\//gi) > -1 && (
          <HeaderElement
            handleClick={() => saveProgress(animals, gameID, saveID)}
            absolute
            bottom='10px'
            text='Save'
            icon='save'/>)}
      </Header>
      {
        url && router(url, props)
      }
      {message && <ModalMessage
        header={message.header}
        body={message.body}/>
      }
      <Transition>
        {toast !== '' && <Toast minHeight='none' w='200px' textAlign='center' bgColor='#333' color='white' top='none' bottom='8px' key='0' onDismiss={() => setToast('')}>
          <Text>{toast}</Text>
        </Toast>}
      </Transition>
    </Block>
  )
}

export default {
  onCreate,
  render
}

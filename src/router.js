/** @jsx element */

import {initializeApp, createNew, refresh, saveProgress, setToast} from './actions'
import HeaderElement from './components/HeaderElement'
import ModalMessage from './components/ModalMessage'
import CreateSandbox from './pages/CreateSandbox'
import {Block, Icon, Text, Toast} from 'vdux-ui'
import {setUrl} from 'redux-effects-location'
import {signOut} from './middleware/auth'
import Profile from './pages/Profile'
import Transition from 'vdux-transition'
import Header from './components/Header'
import {Button} from 'vdux-containers'
import Create from './pages/Create'
import Auth from './components/Auth'
import HomePage from './pages/Home'
import element from 'vdux/element'
import Game from './pages/Game'
import enroute from 'enroute'

import createAction from '@f/create-action'

const startLogin = createAction('START_LOGIN')
const endLogin = createAction('END_LOGIN')

const initialState = () => ({loggingIn: false})

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
  if (props.user && !props.user.isAnonymous) {
    return <Profile user={props.user}/>
  }
  return <HomePage left='60px' {...props} />
}

function onCreate () {
  return initializeApp()
}

function render ({props, state, local}) {
  const {loggingIn} = state
  const {message, url, game, saveID, gameID, toast, user} = props
  const {animals} = game

  return (
    <Block tall wide>
      <Header w='60px' bgColor='primary' top='0' left='0'>
        <HeaderElement background='url(/animalImages/zebra.jpg)' handleClick={[() => setUrl('/'), refresh]} text='Pixel Bots'/>
        <HeaderElement handleClick={createNew} text='Challenge' icon='note_add'/>
        {!user || user.isAnonymous
          ? <HeaderElement absolute bottom='10px' handleClick={local(startLogin)} text='Sign In' icon='person_outline'/>
          : <HeaderElement absolute bottom='10px' handleClick={signOut} text='Sign Out' icon='exit_to_app'/>
        }
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
      {
        loggingIn && <Auth handleDismiss={local(endLogin)}/>
      }
      <Transition>
        {toast !== '' && <Toast minHeight='none' w='200px' textAlign='center' bgColor='#333' color='white' top='none' bottom='8px' key='0' onDismiss={() => setToast('')}>
          <Text>{toast}</Text>
        </Toast>}
      </Transition>
    </Block>
  )
}

function reducer (state, action) {
  console.log(action)
  if (action.type === startLogin.type) {
    return {
      ...state,
      loggingIn: true
    }
  } else if (action.type === endLogin.type) {
    return {
      ...state,
      loggingIn: false
    }
  }
}

export default {
  initialState,
  reducer,
  onCreate,
  render
}

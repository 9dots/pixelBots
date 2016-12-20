/** @jsx element */

import {initializeApp, createNew, refresh, saveProgress, setToast, setModalMessage} from './actions'
import IndeterminateProgress from './components/IndeterminateProgress'
import HeaderElement from './components/HeaderElement'
import ModalMessage from './components/ModalMessage'
import CreateSandbox from './pages/CreateSandbox'
import PlaylistView from './pages/PlaylistView'
import ProfileLoader from './pages/ProfileLoader'
import LinkModal from './components/LinkModal'
import {Block, Icon, Input, Text, Toast} from 'vdux-ui'
import LinkDecipher from './pages/LinkDecipher'
import CodeLink from './components/CodeLink'
import {setUrl} from 'redux-effects-location'
import GameLoader from './pages/GameLoader'
import SearchPage from './pages/SearchPage'
import {signOut} from './middleware/auth'
import Transition from 'vdux-transition'
import Header from './components/Header'
import {Button} from 'vdux-containers'
import Auth from './components/Auth'
import Create from './pages/Create'
import HomePage from './pages/Home'
import element from 'vdux/element'
import enroute from 'enroute'

import createAction from '@f/create-action'

const startLogin = createAction('START_LOGIN')
const endLogin = createAction('END_LOGIN')


const initialState = () => ({loggingIn: false})

const router = enroute({
  '/create/:draftID/:slug': ({draftID, slug}, props) => {
    return <Create left='60px' draftID={draftID} params={slug} {...props}/>
  },
  '/sandbox': (params, props) => (
    <HomePage {...props}/>
  ),
  '/search': (params, props) => {
    return <SearchPage user={props.user}/>
  },
  '/search/:searchType': ({searchType}, props) => {
    return <SearchPage searchType={searchType} user={props.user}/>
  },
  '/search/:searchType/:searchQ': ({searchType, searchQ}, props) => (
    <SearchPage searchType={searchType} searchQ={searchQ} user={props.user}/>
  ),
  '/playlist/:playlistID': ({playlistID, username}, props) => (
    <PlaylistView activeKey={playlistID} uid={props.user.uid}/>
  ),
  '/games/:gameID': ({gameID}, props) => (
    <GameLoader {...props} left='60px' noSave gameCode={gameID}/>
  ),
  '/:username/:activity': ({username, activity}, props) => {
    return <ProfileLoader params={activity} currentUser={props.user} username={username}/>
  },
  '/:link': ({link}, props) => <LinkDecipher link={link} {...props}/>,
  '*': homePage
})

function homePage (params, props) {
  if (!props.user || (props.user && Object.keys(props.user).length === 0) || (!props.user.isAnonymous && !props.username)) {
    return <IndeterminateProgress/>
  }
  if (props.user && props.username && !props.user.isAnonymous) {
    return <ProfileLoader mine username={props.username} currentUser={props.user}/>
  }
  return <HomePage {...props} />
}

function onCreate () {
  return initializeApp()
}

function render ({props, state, local}) {
  const {loggingIn} = state
  const {message, url, game, saveID, gameID, toast, user, username} = props
  const {animals} = game
  const activeRoute = url.split('/')[1]

  return (
    <Block tall wide>
      <Header w='90px' bgColor='primary' top='0' left='0'>
        <Block flex>
          <HeaderElement 
            image='/animalImages/zebra.jpg'
            handleClick={[() => setUrl('/'), refresh]}/>
          {(user && !user.isAnonymous) &&
            <Block>
              <HeaderElement active={activeRoute === 'search'} onClick={() => setUrl('/search/games')} text='Search' icon='search'/>
              <HeaderElement active={activeRoute === username} onClick={() => setUrl(`/${username}/games`)} text='Your Stuff' icon='dashboard'/>
              <HeaderElement active={activeRoute === 'sandbox'} onClick={() => setUrl('/sandbox')} text='Sandbox' icon='play_circle_outline'/>
              <HeaderElement active={activeRoute === 'create'} onClick={createNew} text='Create' icon='add'/>
            </Block>
          }
        </Block>
        <HeaderElement onClick={() => setModalMessage(<CodeLink/>)} mb='0' text='Code' icon='link'/>
        {!user || user.isAnonymous
          ? <HeaderElement handleClick={local(startLogin)} text='Sign In' icon='person_outline'/>
          : <HeaderElement handleClick={signOut} text='Sign Out' icon='exit_to_app'/>
        }
      </Header>
      <Block class='action-bar-holder' overflowY='auto' relative left='90px' p='20px' column align='start' minHeight='100%' w='calc(100% - 90px)' tall>
      {
        (url && user) && router(url, props)
      }
      </Block>
      {
        message && message
      }
      {
        loggingIn && <Auth handleDismiss={local(endLogin)}/>
      }
      <Transition>
        {toast !== '' && <Toast
          fixed
          minHeight='none'
          w='200px'
          textAlign='center'
          bgColor='#333'
          color='white'
          top='none'
          bottom='8px'
          key='0'
          onDismiss={() => setToast('')}>
          <Text>{toast}</Text>
        </Toast>}
      </Transition>
    </Block>
  )
}

function reducer (state, action) {
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

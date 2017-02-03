/** @jsx element */

import {initializeApp, createNew, refresh, setToast, setModalMessage} from './actions'
import IndeterminateProgress from './components/IndeterminateProgress'
import HeaderElement from './components/HeaderElement'
import PlaylistView from './pages/PlaylistView'
import ProfileLoader from './pages/ProfileLoader'
import {Block, Text, Toast} from 'vdux-ui'
import LinkDecipher from './pages/LinkDecipher'
import CodeLink from './components/CodeLink'
import {setUrl} from 'redux-effects-location'
import GameLoader from './pages/GameLoader'
import SearchPage from './pages/SearchPage'
import {signOut} from './middleware/auth'
import Transition from 'vdux-transition'
import Header from './components/Header'
import Auth from './components/Auth'
import Create from './pages/Create'
import HomePage from './pages/Explore'
import element from 'vdux/element'
import enroute from 'enroute'

import createAction from '@f/create-action'

const startLogin = createAction('START_LOGIN')
const endLogin = createAction('END_LOGIN')

const initialState = () => ({loggingIn: false})

const router = enroute({
  '/featured': () => <HomePage tab='featured'/>,
  '/featured/:project': ({project}) => (
    <HomePage tab='featured' project={project} />
  ),
  '/shared': () => <HomePage tab='shared'/>,
  '/create/:draftID': ({draftID, step}, props) => (
    <Create mine new left='60px' draftID={draftID} {...props}/>
  ),
  '/create/:draftID/:step': ({draftID, step}, props) => (
    <Create mine new left='60px' draftID={draftID} step={step} {...props}/>
  ),
  '/edit/:draftID/:step': ({draftID, step}, props) => (
    <Create mine left='60px' draftID={draftID} step={step} {...props}/>
  ),
  '/edit/:draftID': ({draftID, step}, props) => (
    <Create mine left='60px' draftID={draftID} {...props}/>
  ),
  '/search': (params, props) => (
    <SearchPage user={props.user}/>
  ),
  '/search/:searchType': ({searchType}, props) => (
    <SearchPage searchType={searchType} user={props.user}/>
  ),
  '/search/:searchType/:searchQ': ({searchType, searchQ}, props) => (
    <SearchPage searchType={searchType} searchQ={searchQ} user={props.user}/>
  ),
  '/playlist/:playlistID': ({playlistID, username}, props) => (
    <PlaylistView activeKey={playlistID} uid={props.user.uid}/>
  ),
  '/games/:gameID': ({gameID}, props) => (
    <GameLoader {...props} left='60px' noSave gameCode={gameID}/>
  ),
  '/:username/:activity': ({username, activity}, props) => (
    <ProfileLoader params={activity} currentUser={props.user} username={username}/>
  ),
  '/:link': ({link}, props) => <LinkDecipher link={link} {...props}/>,
  '*': homePage
})

function homePage (params, props) {
  if (!props.user || (props.user && Object.keys(props.user).length === 0) || (!props.user.isAnonymous && !props.username)) {
    return <IndeterminateProgress/>
  }
  return <HomePage {...props} />
}

function onCreate () {
  return initializeApp()
}

function render ({props, state, local}) {
  const {loggingIn} = state
  const {message, url, toast, user, username} = props
  const activeRoute = url.split('/')[1]

  return (
    <Block tall wide>
      <Header w='90px' bgColor='primary' top='0' left='0'>
        <Block flex>
          <HeaderElement
            text='Home'
            icon='home'
            active={activeRoute === 'featured'}
            handleClick={[() => setUrl('/'), refresh]}/>
          <HeaderElement active={activeRoute === 'search'} onClick={() => setUrl('/search/games')} text='Search' icon='search'/>
          {(user && !user.isAnonymous) &&
            <Block>
              <HeaderElement active={activeRoute === username} onClick={() => setUrl(`/${username}/playlists`)} text='Your Stuff' icon='dashboard'/>
              <HeaderElement active={activeRoute === 'create'} onClick={() => createNew(user.uid)} text='Create' icon='add'/>
            </Block>
          }
        </Block>
        <HeaderElement onClick={() => setModalMessage(<CodeLink/>)} mb='0' text='Code' icon='link'/>
        {!user || user.isAnonymous
          ? <HeaderElement handleClick={local(startLogin)} text='Sign In' icon='person_outline'/>
          : <HeaderElement handleClick={signOut} text='Sign Out' icon='exit_to_app'/>
        }
      </Header>
      <Block class='action-bar-holder' overflowY='auto' relative left='90px' column align='start' minHeight='100%' w='calc(100% - 90px)' h='100vh'>
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

// <HeaderElement active={activeRoute === 'sandbox'} onClick={[() => setUrl('/sandbox'), refresh]} text='Sandbox' icon='play_circle_outline'/>

export default {
  initialState,
  reducer,
  onCreate,
  render
}

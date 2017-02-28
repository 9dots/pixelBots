/** @jsx element */

import {initializeApp, refresh, setToast, setModalMessage} from './actions'
import HeaderElement from './components/HeaderElement'
import PrintContainer from './pages/PrintContainer'
import PlaylistLoader from './pages/PlaylistLoader'
import CreateModal from './components/CreateModal'
import ProfileLoader from './pages/ProfileLoader'
import PlaylistView from './pages/PlaylistView'
import LinkDecipher from './pages/LinkDecipher'
import CodeLink from './components/CodeLink'
import {setUrl} from 'redux-effects-location'
import ProjectPage from './pages/ProjectPage'
import GameLoader from './pages/GameLoader'
import SearchPage from './pages/SearchPage'
import Loading from './components/Loading'
import {Block, Text, Toast} from 'vdux-ui'
import {signOut} from './middleware/auth'
import Transition from 'vdux-transition'
import Header from './components/Header'
import HomePage from './pages/Explore'
import Auth from './components/Auth'
import Create from './pages/Create'
import element from 'vdux/element'
import enroute from 'enroute'

import createAction from '@f/create-action'

const startLogin = createAction('START_LOGIN')
const endLogin = createAction('END_LOGIN')

function onUpdate (prev, {state}) {
  if (prev.state.title !== state.title) {
    document.title = state.title
  }
}

const initialState = () => ({loggingIn: false})

const router = enroute({
  '/featured': () => <HomePage tab='featured' />,
  '/featured/:project': ({project}) => (
    <HomePage tab='featured' project={project} />
  ),
  '/shared': () => <HomePage tab='shared' />,
  '/create/:draftID': ({draftID, step}, props) => (
    <Create mine new left='60px' draftID={draftID} {...props} />
  ),
  '/create/:draftID/:step': ({draftID, step}, props) => (
    <Create mine new left='60px' draftID={draftID} step={step} {...props} />
  ),
  '/edit/:draftID/:step': ({draftID, step}, props) => (
    <Create mine left='60px' draftID={draftID} step={step} {...props} />
  ),
  '/edit/:draftID': ({draftID, step}, props) => (
    <Create mine left='60px' draftID={draftID} {...props} />
  ),
  '/search': (params, props) => (
    <SearchPage user={props.user} />
  ),
  '/search/:searchType': ({searchType}, props) => (
    <SearchPage searchType={searchType} user={props.user} />
  ),
  '/search/:searchType/:searchQ': ({searchType, searchQ}, props) => (
    <SearchPage searchType={searchType} searchQ={searchQ} user={props.user} />
  ),
  '/playlist/:playlistID': ({playlistID, username}, props) => (
    <PlaylistView w='80%' minWidth='680px' margin='0 auto' activeKey={playlistID} uid={props.user.uid} />
  ),
  '/games/:gameID': ({gameID}, props) => (
    <ProjectPage gameRef={gameID} />
  ),
  '/playSequence/:listID': ({listID}, props) => (
    <PlaylistLoader {...props} playlistRef={listID} uid={props.user.uid} ref='nothing' />
  ),
  '/play/:gameID': ({gameID}, props) => (
    <GameLoader
      {...props}
      completed={
        props.profile.completed &&
        props.profile.completed[gameID] &&
        props.profile.completed[gameID].saveRef
      }
      key={`gameLoader${gameID}`}
      gameCode={gameID} />
  ),
  '/:username/:activity': ({username, activity}, props) => (
    <ProfileLoader mine={props.user.username === username} params={activity} currentUser={props.user} username={username} />
  ),
  '/:username/:activity/:category': ({username, activity, category}, props) => (
    <ProfileLoader
      params={activity}
      category={category}
      currentUser={props.user}
      username={username} />
  ),
  '/:link': ({link}, props) => <LinkDecipher link={link} {...props} />,
  '*': homePage
})

function homePage (params, props) {
  if (!props.user || (props.user && Object.keys(props.user).length === 0) || (!props.user.isAnonymous && !props.username)) {
    return <Loading />
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

  if (!props.user || props.username === undefined) {
    return <Loading />
  }

  return (
    <Block tall>
      <PrintContainer code={!!props.game && props.game.animals[0].sequence} />
      <Header w='80px' top='0' left='0'>
        <Block flex>
          <HeaderElement
            text='Home'
            icon='home'
            active={activeRoute === 'featured'}
            handleClick={[() => setUrl('/'), refresh]} />
          <HeaderElement active={activeRoute === 'search'} onClick={() => setUrl('/search/games')} text='Search' icon='search' />
          {(user && !user.isAnonymous) &&
            <Block>
              <HeaderElement
                active={activeRoute === username}
                onClick={() => activeRoute !== username && setUrl(`/${username}/studio`)}
                text='Profile'
                icon='dashboard' />
              <HeaderElement active={activeRoute === 'create'} onClick={() => setModalMessage(<CreateModal />)} text='Create' icon='add' />
            </Block>
          }
        </Block>
        <HeaderElement onClick={() => setModalMessage(<CodeLink />)} mb='0' text='Code' icon='link' />
        {!user || user.isAnonymous
          ? <HeaderElement handleClick={local(startLogin)} text='Sign In' icon='person_outline' />
          : <HeaderElement handleClick={signOutClick} text='Sign Out' icon='exit_to_app' />
        }
      </Header>
      <Block id='action-bar-holder' class='action-bar-holder' tall overflowY='auto' relative left='80px' column align='start' minHeight='100%' w='calc(100% - 80px)'>
        {
        (url && user) && router(url, props)
      }
      </Block>
      {
        message && message
      }
      {
        loggingIn && <Auth handleDismiss={local(endLogin)} />
      }
      <Transition>
        {toast !== '' && <Toast
          fixed
          minHeight='none'
          w='200px'
          textAlign='center'
          bgColor='#333'
          color='white'
          top='8px'
          bottom='none'
          key='0'
          onDismiss={() => setToast('')}>
          <Text>{toast}</Text>
        </Toast>}
      </Transition>
    </Block>
  )
}

function * signOutClick () {
  yield setUrl('/')
  yield signOut()
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
  onUpdate,
  reducer,
  onCreate,
  render
}

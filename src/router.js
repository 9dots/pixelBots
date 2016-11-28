/** @jsx element */

import {initializeApp, createNew, refresh, saveProgress, setToast} from './actions'
import IndeterminateProgress from './components/IndeterminateProgress'
import HeaderElement from './components/HeaderElement'
import ModalMessage from './components/ModalMessage'
import CreateSandbox from './pages/CreateSandbox'
import ProfileLoader from './pages/ProfileLoader'
import {Block, Icon, Text, Toast} from 'vdux-ui'
import LinkDecipher from './pages/LinkDecipher'
import {setUrl} from 'redux-effects-location'
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
  '/create/:gameID/:slug': ({slug, gameID}, props) => {
    return <Create left='60px' gameID={gameID} params={slug} {...props} />
  },
  '/search': (params, props) => {
    return <SearchPage user={props.user}/>
  },
  '/search/:searchType': ({searchType}, props) => {
    return <SearchPage searchType={searchType} user={props.user}/>
  },
  '/search/:searchType/:searchQ': ({searchType, searchQ}, props) => (
    <SearchPage searchType={searchType} searchQ={searchQ} user={props.user}/>
  ),
  '/:username/:activity': ({username, activity}, props) => {
    return <ProfileLoader params={activity} currentUser={props.user} username={username}/>
  },
  '/:link': ({link}, props) => <LinkDecipher link={link} {...props}/>,
  '*': homePage
})

function homePage (params, props) {
  if (props.user && Object.keys(props.user).length === 0 || !props.username) {
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
              <HeaderElement active={activeRoute === 'search'} onClick={() => setUrl('/search')} text='Search' icon='search'/>
              <HeaderElement active={activeRoute === username} onClick={() => setUrl('/')} text='Your Stuff' icon='dashboard'/>
            </Block>
          }
        </Block>
        {!user || user.isAnonymous
          ? <HeaderElement handleClick={local(startLogin)} text='Sign In' icon='person_outline'/>
          : <HeaderElement handleClick={signOut} text='Sign Out' icon='exit_to_app'/>
        }
      </Header>
      <Block overflowY='auto' relative left='90px' p='20px' column align='start' minHeight='100%' w='calc(100% - 90px)' tall>
      {
        url && router(url, props)
      }
      </Block>
      {message && <ModalMessage
        header={message.header}
        body={message.body}/>
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

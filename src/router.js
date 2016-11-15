/** @jsx element */

import {initializeApp, createNew, refresh} from './actions'
import ModalMessage from './components/ModalMessage'
import CreateSandbox from './pages/CreateSandbox'
import {setUrl} from 'redux-effects-location'
import {Block, Icon, Text} from 'vdux-ui'
import {signOut} from './middleware/auth'
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
  '/': homePage,
  '/play/:gameID': (params, props) => (
    <Game key={params.gameID} {...props} left='60px' gameID={params.gameID}/>
  ),
  '/:gameID/create/:slug': ({slug, gameID}, props) => (
    <Create left='60px' gameID={gameID} params={slug} {...props} />
  )
})

function homePage (params, props) {
  return <HomePage left='60px' {...props} />
}

function onCreate () {
  return initializeApp()
}

function render ({props, state, local}) {
  const {message, user} = props
  const {loggingIn} = state
  return (
    <Block tall wide>
      <Header w='60px' bgColor='primary' top='0' left='0'>
        <Block mt='10px' cursor='pointer' onClick={[() => setUrl('/'), refresh]} relative>
          <Block
            h='40px'
            w='40px'
            mb='10px'
            display='inline-block'
            bgColor='transparent'
            cursor='pointer'
            background={'url(/animalImages/zebra.jpg)'}
            backgroundSize='contain'/>
          <Text w='150px' absolute color='white' fs='m' top='10px' left='63px'>Pixel Bots</Text>
        </Block>
        <Block relative cursor='pointer' hoverProps={{highlight: true}} onClick={createNew}>
          <Block
            h='40px'
            borderWidth='0'
            hoverProps={{color: 'white'}}
            cursor='pointer'
            bgColor='transparent'
            color='#e5e5e5'
            my='10px'
            w='40px'
            align='center center'>
            <Icon transition={'all .3s ease-in-out'} fs='30px' name='note_add'/>
          </Block>
          <Text w='150px' absolute color='white' fs='m' top='10px' left='63px'>Challenge</Text>
        </Block>
        {user.isAnonymous
          ? <Button onClick={local(startLogin)}>Login</Button>
          : <Button onClick={signOut}>Logout</Button>
        }
      </Header>
      {
        router(props.url, props)
      }
      {message && <ModalMessage
        header={message.header}
        body={message.body}/>
      }
      {
        loggingIn && <Auth handleDismiss={() => local(endLogin)}/>
      }
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

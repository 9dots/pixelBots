/** @jsx element */

import {setUrl} from 'redux-effects-location'
import Header from './components/Header'
import {initializeApp, createNew} from './actions'
import Create from './pages/Create'
import HomePage from './pages/Home'
import element from 'vdux/element'
import enroute from 'enroute'
import {Block, Icon, Text} from 'vdux-ui'
import Game from './pages/Game'

const router = enroute({
  '/': (params, props) => <HomePage left='60px' {...props} />,
  '/play/:gameID': (params, props) => (
    <Game {...props} left='60px' gameID={params.gameID}/>
  ),
  '/:gameID/create/:slug': ({slug, gameID}, props) => (
    <Create left='60px' gameID={gameID} params={slug} {...props} />
  )
})

function onCreate () {
  return initializeApp()
}

function render ({local, props}) {
  return (
    <Block tall wide>
      <Header w='60px' bgColor='primary' top='0' left='0'>
        <Block mt='10px' cursor='pointer' onClick={() => setUrl('/')} relative>
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
        <Block relative cursor='pointer' onClick={createNew}>
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
            <Icon transition={'all .3s ease-in-out'} fs='30px' name='add'/>
          </Block>
          <Text w='150px' absolute color='white' fs='m' top='10px' left='63px'>Create</Text>
        </Block>
      </Header>
      {
        router(props.url, props)
      }
    </Block>
  )
}

export default {
  onCreate,
  render
}

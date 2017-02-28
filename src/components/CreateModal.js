import {createNew, clearMessage} from '../actions'
import handleActions from '@f/handle-actions'
import {setUrl} from 'redux-effects-location'
import CreatePlaylist from './CreatePlaylist'
import createAction from '@f/create-action'
import {Block, Flex, Text} from 'vdux-ui'
import ModalMessage from './ModalMessage'
import element from 'vdux/element'
import {fbTask} from '../utils'
import Button from './Button'

const togglePlaylistCreate = createAction('<CreateModal/>: togglePlaylistCreate')

const initialState = () => ({createPlaylist: false})

function render ({props, state, local}) {
  const {createPlaylist} = state
  const {uid, username} = props

  const buttons = (
    <Block wide>
      <Flex fs='l' align='space-around center'>
        <Button
          display='block'
          w='180px'
          fs='m'
          fontWeight='300'
          border='1px solid #AAA'
          hoverProps={{borderColor: 'blue', color: 'blue'}}
          color='#666'
          onClick={[() => createNew(uid), clearMessage]}
          bgColor='#FFF'>Challenge</Button>
        <Button
          display='block'
          w='180px'
          fs='m'
          fontWeight='300'
          border='1px solid #AAA'
          hoverProps={{borderColor: 'blue', color: 'blue'}}
          color='#666'
          onClick={local(togglePlaylistCreate)}
          bgColor='#FFF'>Playlist</Button>
      </Flex>
    </Block>
  )
  const body = createPlaylist
  	? <CreatePlaylist onAddToPlaylist={onAdded} handleDismiss={local(togglePlaylistCreate)} />
  	: buttons
  return (
    <ModalMessage
      bgColor='#FAFAFA'
      header='Create'
      noFooter
      bodyProps={{pb: '2em'}}
      body={body} />
  )

 	function * onAdded () {
   yield clearMessage()
   yield setUrl(`/${username}/authored/playlists`)
 }
}

const reducer = handleActions({
  [togglePlaylistCreate.type]: (state) => ({...state, createPlaylist: !state.createPlaylist})
})

function getProps (props, context) {
  return {
    ...props,
    username: context.username,
    uid: context.currentUser.uid
  }
}

export default {
  initialState,
  getProps,
  reducer,
  render
}

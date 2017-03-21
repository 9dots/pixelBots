/**
 * Imports
 */


import CreatePlaylist from 'components/CreatePlaylist'
import initialGameState from 'utils/initialGameState'
import ModalMessage from 'components/ModalMessage'
import {Block, Flex, Text} from 'vdux-ui'
import {component, element} from 'vdux'
import Button from 'components/Button'

/**
 * <Create Modal/>
 */

export default component({
	intitialState: {
		createPlaylist: false
	},
  render ({context, state, actions}) {
		const {createPlaylist} = state
	  const {uid, username} = context

	  const buttons = (
	    <Block wide py='20px'>
	      <Flex fs='l' align='space-around center'>
	        <Button
	          display='block'
	          w='180px'
	          fs='m'
	          fontWeight='300'
	          border='1px solid #AAA'
	          hoverProps={{borderColor: 'blue', color: 'blue'}}
	          color='#666'
	          onClick={[actions.createGame, context.closeModal]}
	          bgColor='#FFF'>Challenge</Button>
	        <Button
	          display='block'
	          w='180px'
	          fs='m'
	          fontWeight='300'
	          border='1px solid #AAA'
	          hoverProps={{borderColor: 'blue', color: 'blue'}}
	          color='#666'
	          onClick={actions.togglePlaylistCreate}
	          bgColor='#FFF'>Playlist</Button>
	      </Flex>
	    </Block>
	  )
	  const body = createPlaylist
	  	? <CreatePlaylist onAddToPlaylist={actions.onAdded} handleDismiss={actions.togglePlaylistCreate} />
	  	: buttons
	  return (
	    <ModalMessage
	      bgColor='#FAFAFA'
	      header='Create'
	      noFooter
	      bodyProps={{pb: '2em'}}
	      body={body} />
	  )
  },
  controller: {
  	* onAdded ({context}) {
  		yield context.closeModal()
  		yield context.setUrl(`/${context.username}/authored/playlists`)
  	},
  	* createGame ({context}) {
  		const {key} = yield context.firebasePush('/drafts', {
  			creatorID: context.uid,
  			...initialGameState
  		})
  		yield context.firebasePush(`/users/${context.uid}/drafts`, {ref: key})
  		yield context.setUrl(`/create/${key}`)
  	}
  },
  reducer: {
  	togglePlaylistCreate: (state) => ({...state, createPlaylist: !state.createPlaylist})
  }
})

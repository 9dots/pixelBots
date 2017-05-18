/**
 * Imports
 */


import CreatePlaylist from 'components/CreatePlaylist'
import initialGameState from 'utils/initialGameState'
import ModalMessage from 'components/ModalMessage'
import {Block, Flex, Icon} from 'vdux-ui'
import {component, element} from 'vdux'
import Button from 'components/Button'

console.log(initialGameState)
/**
 * <Create Modal/>
 */

export default component({
	intitialState: {
		createPlaylist: false
	},
  render ({context, state, actions, props}) {
		const {createPlaylist} = state
	  const {uid, username} = context

	  const buttons = (
	    <Block wide py='20px'>
	      <Flex fs='l' align='space-around center' pb='l'>
	        <Button
	          onClick={actions.togglePlaylistCreate}
	          bgColor='green'
	          w='180px'
	          py='s'
	          fs='m'>
	          	<Icon name='view_list' fs='m' mr='s' />
	          	Playlist
          	</Button>
	        <Button
	          onClick={[actions.createGame, context.closeModal]}
	          bgColor='blue'
	          w='180px'
	          py='s'
	          fs='m'>
	          	<Icon name='stars' fs='m' mr='s' />
	          	Challenge
          	</Button>
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
  		yield context.firebaseSet(`/users/${context.uid}/drafts/${key}`, true)
  		yield context.setUrl(`/create/${key}`)
  	}
  },
  reducer: {
  	togglePlaylistCreate: (state) => ({...state, createPlaylist: !state.createPlaylist})
  }
})

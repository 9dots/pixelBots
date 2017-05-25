/**
 * Imports
 */


import CreatePlaylist from 'components/CreatePlaylist'
import initialGameState from 'utils/initialGameState'
import ModalMessage from 'components/ModalMessage'
import {Block, Flex, Icon} from 'vdux-ui'
import {component, element} from 'vdux'
import Button from 'components/Button'

/**
 * <Create Modal/>
 */

const CreateModal = component({
  render ({context, state, actions, props}) {
		const {createPlaylist} = state
	  const {uid, username} = context

	  const body = (
	    <Block wide py='20px'>
	      <Flex fs='l' align='space-around center' pb='l'>
	        <Button
	          onClick={context.openModal(() => 
	          	<CreatePlaylist 
	          		cancel='Back' 
	          		handleDismiss={context.openModal(() => <CreateModal />)}
          		/>)}
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
  	* createGame ({context}) {
  		const {key} = yield context.firebasePush('/drafts', {
  			creatorID: context.uid,
  			...initialGameState
  		})
  		yield context.firebaseSet(`/users/${context.uid}/drafts/${key}`, true)
  		yield context.setUrl(`/create/${key}`)
  	}
  }
})

export default CreateModal

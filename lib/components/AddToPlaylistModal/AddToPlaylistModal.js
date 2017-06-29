/**
 * Imports
 */

import maybeAddToArray from 'utils/maybeAddToArray'
import ModalMessage from 'components/ModalMessage'
import {Block, Menu, Checkbox, Icon} from 'vdux-ui'
import {MenuItem} from 'vdux-containers'
import Loading from 'components/Loading'
import {component, element} from 'vdux'
import Button from 'components/Button'
import mapValues from '@f/map-values'
import orderBy from 'lodash/orderBy'
import union from 'lodash/union'
import filter from '@f/filter'
import fire from 'vdux-fire'

/**
 * <Add To Playlist Modal/>
 */

export default fire((props) => ({
  myPlaylists: `/users/${props.uid}/playlists`
}))(component({
	initialState: {
		selected: []
	},
  render ({props, actions, context, state}) {
	  const {myPlaylists, gameID, cancel = 'Cancel', onSubmit = {}, onCancel={}} = props
	  const {username, uid} = context
	  const {selected} = state

	  const filteredPlaylists = orderBy(filter((playlist) => playlist.creatorID === uid, myPlaylists.value || {}), ['lastEdited'], ['desc'])

	  const body = myPlaylists.loading
			? <Loading />
			: <Menu
			    border='1px solid divider'
			    bgColor='#EEE'
			    mb='l'
			    pb='s'
			    column
			    maxHeight='200px'
			    overflowY='auto'>
			    {
			    	mapValues((playlist, key) => 
			    		<Block py='s' px mx='s' mt='s' hoverProps={{highlight: .02}} align='space-between center' borderRadius={3} bgColor='white'
			    			boxShadow='0 1px 1px rgba(0,0,0,.3)'>
			      		{ playlist.name || playlist.title }
			    			<Button bgColor='green' ml py='s' onClick={[
			    				actions.addToPlaylists(gameID, playlist.ref),
			    				actions.checkBoxClick(),
			    				context.closeModal()
		    					]}>
	    						Move <Icon name='reply' transform='scaleX(-1)' ml='s' fs='m' />
    						</Button>
			    		</Block>
			    	, filteredPlaylists || {})
			    }
			  </Menu>
	  const footer = (
	    <Block>
	      <Button
	        onClick={[context.closeModal(), onCancel]}
	        bgColor='#FAFAFA'
	        color='#666'
	        fs='s'
	        border='none'>{cancel}</Button>
	    </Block>
		)
	  return (
	    <ModalMessage
	      bgColor='#FAFAFA'
	      header='Move to Playlist'
	      body={body}
	      footer={footer} />
	  )
  },
  controller: {
  	* addToPlaylists ({context, props}, gameID, ref) {
	  	yield context.firebaseTransaction(
	  		`/playlists/${ref}/sequence`,
	  		(seq) => !seq ? [gameID] : union(seq, [gameID])
	  	)
	  	yield context.firebaseUpdate(`/playlists/${ref}`, {
	  		lastEdited: Date.now()
	  	})
		  yield context.toast(`Added game to playlist`)
  	}
  },
  reducer: {
  	checkBoxClick: (state, ref) => ({...state, selected: maybeAddToArray(ref, state.selected)})
  }
}))

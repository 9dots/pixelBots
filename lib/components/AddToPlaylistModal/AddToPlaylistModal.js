/**
 * Imports
 */

import maybeAddToArray from 'utils/maybeAddToArray'
import ModalMessage from 'components/ModalMessage'
import {Block, Menu, Checkbox} from 'vdux-ui'
import {MenuItem} from 'vdux-containers'
import Loading from 'components/Loading'
import {component, element} from 'vdux'
import Button from 'components/Button'
import mapValues from '@f/map-values'
import orderBy from 'lodash/orderBy'
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
	  const {myPlaylists, gameID, cancel = 'Cancel', onSubmit = {}} = props
	  const {username, uid} = context
	  const {selected} = state
	  const filteredPlaylists = orderBy(filter((playlist) => playlist.creatorID === uid, myPlaylists.value || {}), ['lastEdited'], ['desc'])

	  console.log(cancel)

	  const body = myPlaylists.loading
			? <Loading />
			: <Menu
			    border='1px solid #e0e0e0'
			    bgColor='#FFF'
			    column
			    maxHeight='200px'
			    overflowY='auto'>
			    {mapValues((playlist, key) => <MenuItem align='space-between center'>
			      {playlist.name || playlist.title}
			      <Checkbox
			        checked={selected.indexOf(playlist.ref) > -1}
			        onChange={actions.checkBoxClick(playlist.ref)} />
			    	</MenuItem>, filteredPlaylists || {})}
			  </Menu>
	  const footer = (
	    <Block>
	      <Button
	        onClick={[context.closeModal(), cancel === 'Skip' && onSubmit]}
	        bgColor='#FAFAFA'
	        color='#666'
	        fs='s'
	        border='none'>{cancel}</Button>
	      <Button
	        bgColor='blue'
	        ml='1em'
	        fs='s'
	        onClick={[
	        	onSubmit,
	        	context.closeModal(),
	        	actions.addToPlaylists(gameID, selected),
	        	context.setUrl(`/${username}/authored/playlists`)]}>
	      	Accept
	      </Button>
	    </Block>
		)
	  return (
	    <ModalMessage
	      bgColor='#FAFAFA'
	      header='Add to Playlist'
	      body={body}
	      footer={footer} />
	  )
  },
  controller: {
  	* addToPlaylists ({context, props}, gameID, playlists) {
  		yield context.toast(`added game to ${playlists.length} ${pluralize('playlist', playlists.length)}`)
		  for (let ref in playlists) {
		  	yield context.firebasePush('/queue/tasks', {
		  		_state: 'add_to_playlist',
		  		newGames: [gameID],
		      playlist: playlists[ref]
		  	})
		  }
  	}
  },
  reducer: {
  	checkBoxClick: (state, ref) => ({...state, selected: maybeAddToArray(ref, state.selected)})
  }
}))

function pluralize (str, count) {
  return count === 1 ? str : `${str}s`
}

/**
 * Imports
 */

import {Input, Textarea} from 'vdux-containers'
import createCode from 'utils/createShortCode'
import {component, element} from 'vdux'
import validator from 'schema/playlist'
import Button from 'components/Button'
import {Block} from 'vdux-ui'
import {union} from 'lodash'
import sleep from '@f/sleep'
import Form from 'vdux-form'

const inputProps = {
  h: '42px',
  textIndent: '8px',
  borderRadius: '2px',
  border: '2px solid #ccc'
}

/**
 * <Create Playlist/>
 */

export default component({
	initialState: {
  	playlistName: '',
  	playlistDescription: ''
	},
  render ({props, context, state, actions}) {
	  const {selected = [], handleDismiss, onAddToPlaylist} = props
	  const {playlistName, playlistDescription} = state
	  const {uid, username} = context

	  return (
	    <Block>
	      <Form id='create-playlist' onSubmit={actions.createPlaylist} validate={validator.playlist}>
	        <Block>
	          <Input h='42px'
	            name='playlistTitle'
	            placeholder='Title'
	            name='name'
	            fontWeight='300'
	            fs='s'
	            required
	            inputProps={inputProps} />
	          <Input h='42px'
	            name='playlistDescription'
	            placeholder='Description'
	            name='description'
	            fontWeight='300'
	            fs='s'
	            required
	            inputProps={inputProps} />
	        </Block>
	        <Block align='end center' py='20px'>
	          <Button hoverProps={{color: 'blue', borderColor: 'blue'}} onClick={handleDismiss} color='#999' bgColor='transparent'>Back</Button>
	          <Button form='create-playlist' type='submit' ml='6px' bgColor='blue'>Save</Button>
	        </Block>
	      </Form>
	    </Block>
	  )
  },
  controller: {
  	* createPlaylist ({state, props, context}, {name, description}) {
  		const {selected = [], onAddToPlaylist, handleDismiss} = props
  		const {uid, username} = context
  		const code = yield createCode()
  		const {playlistRef} = yield context.firebasePush('/playlists', {
  			followedBy: {[username]: true},
  			creatorUsername: username,
  			lastEdited: Date.now(),
  			shortLink: code,
  			creatorID: uid,
  			follows: 1,
  			description,
  			name
  		})
  		yield context.firebaseSet(`/links/${code}`, {
  			type: 'playlist',
  			payload: playlistRef
  		})
  		if (onAddToPlaylist) {
  			yield onAddToPlaylist()
  		}
	    yield handleDismiss()
  	}
  }
})

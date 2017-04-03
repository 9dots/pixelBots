/**
 * Imports
 */

import {Block, Dropdown, MenuItem} from 'vdux-containers'
import ConfirmDelete from 'components/ConfirmDelete'
import EditModal from 'components/EditModal'
import validator from 'schema/playlist'
import {component, element} from 'vdux'
import Button from 'components/Button'
import {Icon, Menu} from 'vdux-ui'

export default component({
  render ({props, actions}) {
	  const {
	    activeKey,
	    name,
	    myLists = {},
	    followed,
	    shortLink,
	    playable,
	    play,
	    mine,
	    description
	  } = props

	  const btn = (
	    <MenuItem
	      bgColor='#FAFAFA'
	      focusProps={{highlight: true}}
	      ml='1em'
	      align='center center'
	      circle='40px'>
	      <Icon name='more_vert' />
	    </MenuItem>
	  )
	  const followButton = followed
	    ? <Button
	      onClick={actions.unfollow()}
	      h='38px'
	      bgColor='transparent'
	      color='#666'
	      border='1px solid #666'>Unfollow</Button>
	    : <Button h='38px' bgColor='primary' onClick={actions.follow()}>Follow</Button>

	  return (
	    <Block align='center center'>
	      <Button disabled={!playable} mr='5px' bgColor='blue' onClick={playable && play()}>
	        <Icon ml='-6px' mr='8px' name='play_arrow' />
	        Play
	      </Button>
	      <Button
	        mr='5px'
	        bgColor='green'
	        onClick={props.setModal(shortLink)}>
	        <Icon ml='-6px' mr='8px' name='link' />
	        Share
	      </Button>
	      {followButton}
	      {mine && <Dropdown btn={btn} zIndex='999'>
	        <Menu w='150px' column zIndex='999'>
	          <MenuItem
	            fontWeight='300'
	            onClick={actions.openEdit({
	              title: 'Title', name: 'name', value: name})}>
	            Edit Name
	          </MenuItem>
	          <MenuItem
	            fontWeight='300'
	            onClick={actions.openEdit({
	              title: 'Description', name: 'description', value: description
	            })}>
	            Edit Description
	          </MenuItem>
	        </Menu>
	      </Dropdown>}
	    </Block>
	  )
  },
  controller: {
  	* follow ({context, props}) {
  		const {creatorID, creatorUsername, name, activeKey} = props
  		const {uid, username} = context
  		yield context.firebaseTask('follow_playlist', {
  			uid,
	      username,
	      creatorID,
	      creatorUsername,
	      title: name,
	      ref: activeKey
  		})
  		yield context.toast(`followed ${name}`)
  	},
  	* unfollow ({context, props}) {
  		const {name, activeKey} = props
  		const {uid, username} = context
  		yield context.firebaseTask('unfollow_playlist', {
	      uid,
	      username,
	      ref: activeKey
	    })
	    yield context.toast(`unfollowed ${name}`)
  	},
	  * updatePlaylist ({props, context}, data) {
	  	const {uid} = context
	  	const {activeKey} = props
	  	const updateObject = {...data, lastEdited: Date.now()}
	  	yield context.firebaseUpdate(`/playlists/${activeKey}`, updateObject)
	  	yield context.firebaseUpdate(`/users/${uid}/playlists/${activeKey}`, updateObject)
	  },
	  * openEdit ({props, context, actions}, edit) {
	  	yield context.openModal(() => <EditModal
        label={edit.title}
        field={edit.name}
        onSubmit={(val) => actions.updatePlaylist({
          [edit.name]: val[edit.name]
        })}
        name={edit.name}
        dismiss={context.closeModal()}
        value={edit.value}
        validate={(val) => validator[edit.name](val[edit.name])}
        textarea={edit.name === 'description'}
      />)
	  }
  }
})

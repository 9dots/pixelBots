import IndeterminateProgress from '../components/IndeterminateProgress'
import {Block, Dropdown, Menu, MenuItem, Text} from 'vdux-ui'
import PlaylistOptions from '../components/PlaylistOptions'
import PlaylistItem from '../components/PlaylistItem'
import ModalMessage from '../components/ModalMessage'
import createAction from '@f/create-action'
import Button from '../components/Button'
import {Input} from 'vdux-containers'
import {createCode} from '../utils'
import {refMethod} from 'vdux-fire'
import {setToast} from '../actions'
import element from 'vdux/element'
import filter from '@f/filter'
import sleep from '@f/sleep'
import fire from 'vdux-fire'

const setModal = createAction('<PlaylistView/>: setModal')

const initialState = ({local}) => ({
	modal: '',
	actions: {
		setModal: local((modal) => setModal(modal))
	}
})

const url = window.location.host + '/'

function render ({props, state}) {
	const {playlist, myPlaylists, activeKey, mine, currentUser, ref} = props
	const {uid, isAnonymous} = currentUser

	if (playlist.loading || myPlaylists.loading) {
		return <IndeterminateProgress/>
	}

	const myPlaylistsValue = myPlaylists.value || []
	const playlistMatch = Object.keys(filter((list) => list.ref === activeKey, myPlaylistsValue))[0]
	const {sequence, name, followedBy = [], creatorID, creatorUsername} = playlist.value
	const {modal, actions} = state

	const followed = followedBy[props.username]
	
	const modalFooter = (
	  <Block>
	    <Button ml='m' onClick={() => actions.setModal('')}>Done</Button>
	  </Block>
	)

	const followButton = followed
		? <Button onClick={unfollow} bgColor='transparent' color='#666' border='1px solid #666'>Unfollow</Button>
		: <Button onClick={follow}>Follow</Button>

	return (
		<Block flex ml='10px' tall overflowY='auto' minWidth='680px'>
			<Block align='space-between center' p='10px'>
				<Block>
					<Text display='block' fs='xs' color='#777' fontWeight='300'>CREATED BY: {creatorUsername}</Text>
					<Text display='block' fs='xxl' color='#555' fontWeight='500'>{name}</Text>
				</Block>
				<Block>
					{
						mine
							? <PlaylistOptions uid={uid} name={name} activeKey={activeKey} setModal={actions.setModal} unfollow={unfollow}/>
							: followButton
					}
				</Block>
			</Block>
			<Menu overflowY='auto' column>
			 	<Block color='#999' mt='1em' fontWeight='800' align='start center' bgColor='transparent' mb='4px'>
			 		<Block minWidth='66px' w='66px'/>
			 		<Text flex minWidth='200px' ml='2em'>CHALLENGE NAME</Text>
			 		<Text mr='2em' minWidth='100px' w='100px'>ANIMAL</Text>
			 		<Text mr='2em' minWidth='180px' w='180px'>CODE TYPE</Text>
			 	</Block>
				{sequence && sequence.map((challenge) => <PlaylistItem playlistKey={activeKey} mine={mine && currentUser.uid === creatorID} ref={challenge}/>)}
			</Menu>
			{modal && <ModalMessage
        header='Link to Playlist'
        body={<Input
          readonly
          autofocus
          inputProps={{p: '12px', borderWidth: '2px', border: '#ccc'}}
          id='url-input'
          fs='18px'
          onFocus={() => document.getElementById('url-input').children[0].select()}
          value={`http://${url}${modal}`}>
          {`${url}${modal}`}
        </Input>}
        footer={modalFooter}/>
      }
		</Block>
	)

	function * follow () {
		yield refMethod({
			ref: `/playlists/${activeKey}/follows`,
			updates: {
				method: 'transaction',
				value: (val) => val + 1
			}
		})
		yield refMethod({
			ref: `/playlists/${activeKey}/followedBy/${props.username}`,
			updates: {
				method: 'set',
				value: true
			}
		})
		yield refMethod({
			ref: `/users/${uid}/playlists/`,
			updates: {
				method: 'push',
				value: {
					name,
					creatorID,
					creatorUsername,
					ref: props.activeKey,
					dateAdded: 0 - Date.now()
				}
			}
		})
		yield setToast(`followed ${name}`)
		yield sleep(3000)
		yield setToast('')
	}

	function * unfollow () {
		yield refMethod({
			ref: `/playlists/${activeKey}/follows`,
			updates: {
				method: 'transaction',
				value: (val) => val - 1
			}
		})
		yield refMethod({
			ref: `/playlists/${activeKey}/followedBy/${props.username}`,
			updates: {method: 'remove'}
		})
		yield refMethod({
			ref: `/users/${uid}/playlists/${playlistMatch}`,
			updates: {method: 'remove'}
		})
		yield setToast(`unfollowed ${name}`)
		yield sleep(3000)
		yield setToast('')
	}
}


function getProps (props, context) {
	return {
		...props,
		currentUser: context.currentUser,
		username: context.username
	}
}

function reducer (state, action) {
	switch (action.type) {
		case setModal.type:
			return {
				...state,
				modal: action.payload
			}
	}
	return state
}

export default fire((props) => ({
	playlist: `/playlists/${props.activeKey}`,
	myPlaylists: `/users/${props.uid}/playlists`
}))({
	initialState,
	getProps,
	reducer,
	render
})
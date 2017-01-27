/** @jsx element */

import IndeterminateProgress from '../components/IndeterminateProgress'
import PlaylistGameLoader from '../components/PlaylistGameLoader'
import {Block, Menu, Text} from 'vdux-ui'
import PlaylistOptions from '../components/PlaylistOptions'
import LinkModal from '../components/LinkModal'
import handleActions from '@f/handle-actions'
import createAction from '@f/create-action'
import Button from '../components/Button'
import {refMethod} from 'vdux-fire'
import {setToast} from '../actions'
import element from 'vdux/element'
import filter from '@f/filter'
import findIndex from '@f/find-index'
import splice from '@f/splice'
import sleep from '@f/sleep'
import fire from 'vdux-fire'

const setModal = createAction('<PlaylistView/>: setModal')
const handleDragEnter = createAction('<PlaylistItem/>: HANDLE_DRAG_ENTER')
const handleDragStart = createAction('<PlaylistItem/>: HANLDE_DRAG_START')
const handleDragEnd = createAction('<PlaylistItem/>: HANDLE_END')
const handleDrop = createAction('<PlaylistItem/>: HANDLE_DROP')

const initialState = ({local}) => ({
  modal: '',
  target: null,
  dragTarget: null,
  actions: {
    setModal: local((modal) => setModal(modal)),
    dragEnter: local((gameKey) => handleDragEnter(gameKey)),
    dragStart: local((gameKey) => handleDragStart(gameKey)),
    dragEnd: local(handleDragEnd),
    handleDrop: local(handleDrop)
  }
})

function render ({props, state}) {
  const {playlist, activeKey, currentUser, profile = {}} = props
  const {uid} = currentUser

  if (playlist.loading) {
    return <IndeterminateProgress />
  }

  const myPlaylistsValue = profile && profile.playlists || {}
  const playlistMatch = Object.keys(filter((list) => list.ref === activeKey, myPlaylistsValue))[0]
  const {sequence, name, followedBy = [], creatorID, creatorUsername, description} = playlist.value
  const {modal, actions, target, dragTarget} = state

  const mine = uid === creatorID

  const followed = followedBy[props.username]

  const modalFooter = (
    <Block>
      <Button ml='m' onClick={() => actions.setModal('')}>Done</Button>
    </Block>
	)

  return (
    <Block flex ml='10px' tall overflowY='auto' minWidth='680px'>
      <Block align='space-between center' p='10px'>
        <Block>
          <Text display='block' fs='xs' color='#777' fontWeight='300'>CREATED BY: {creatorUsername}</Text>
          <Text display='block' fs='xxl' color='#555' fontWeight='500'>{name}</Text>
          <Text display='block' fs='m' color='#777' fontWeight='300'>{description}</Text>
        </Block>
        <Block>
          <PlaylistOptions
            follow={follow}
            mine={mine}
            followed={followed}
            uid={uid}
            name={name}
            description={description}
            activeKey={activeKey}
            setModal={actions.setModal}
            unfollow={unfollow} />
        </Block>
      </Block>
      <Menu overflowY='auto' column>
        <Block color='#999' mt='1em' fontWeight='800' align='start center' bgColor='transparent' mb='4px'>
          <Block minWidth='66px' w='66px' />
          <Text flex minWidth='200px' ml='2em'>CHALLENGE NAME</Text>
          <Text mr='2em' minWidth='100px' w='100px'>ANIMAL</Text>
          <Text mr='2em' minWidth='180px' w='180px'>CODE TYPE</Text>
        </Block>
        <PlaylistGameLoader
          dragTarget={dragTarget}
          dropTarget={target}
          listActions={{...actions, drop}}
          activeKey={activeKey}
          mine={mine}
          creatorID={creatorID}
          sequence={sequence} />
      </Menu>
      {modal && <LinkModal
        code={modal}
        footer={modalFooter} />
      }
    </Block>
  )

  function * drop (idx) {
    const removeIdx = findIndex(sequence, (val) => val === dragTarget)
    yield refMethod({
      ref: `/playlists/${activeKey}/sequence`,
      updates: {
        method: 'transaction',
        value: (seq) => (
					seq
						? splice(splice(seq, removeIdx, 1), removeIdx > idx ? idx : idx - 1, 0, dragTarget)
						: 0
				)
      }
    })
    yield actions.handleDrop()
  }

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
    username: context.username,
    profile: context.profile
  }
}

const reducer = handleActions({
  [setModal]: (state, payload) => ({...state, modal: payload}),
  [handleDragEnter]: (state, payload) => ({...state, target: payload}),
  [handleDragEnd]: (state) => ({...state, target: null, dragTarget: null}),
  [handleDrop]: (state) => ({...state, target: null, dragTarget: null}),
  [handleDragStart]: (state, payload) => ({...state, dragTarget: payload})
})

export default fire((props) => ({
  playlist: `/playlists/${props.activeKey}`
}))({
  initialState,
  getProps,
  reducer,
  render
})

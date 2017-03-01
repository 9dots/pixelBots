/** @jsx element */

import IndeterminateProgress from '../components/IndeterminateProgress'
import PlaylistGameLoader from '../components/PlaylistGameLoader'
import PlaylistOptions from '../components/PlaylistOptions'
import {Box, Block, Flex, Menu, Text} from 'vdux-ui'
import Description from '../components/Description'
import LinkModal from '../components/LinkModal'
import handleActions from '@f/handle-actions'
import Layout from '../layouts/HeaderAndBody'
import createAction from '@f/create-action'
import Button from '../components/Button'
import findIndex from '@f/find-index'
import {refMethod} from 'vdux-fire'
import {setToast} from '../actions'
import element from 'vdux/element'
import {fbTask} from '../utils'
import filter from '@f/filter'
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
  const {playlist, activeKey, uid, profile = {}, username, ...restProps} = props
  const {modal, actions, target, dragTarget} = state

  if (playlist.loading) {
    return <IndeterminateProgress />
  }

  const {
    sequence,
    name,
    followedBy = [],
    creatorID,
    imageUrl,
    creatorUsername,
    shortLink,
    description
  } = playlist.value

  const mine = uid === creatorID

  const followed = followedBy[props.username]

  const modalFooter = (
    <Block>
      <Button ml='m' onClick={() => actions.setModal('')}>Done</Button>
    </Block>
  )

  const titleActions = (
    <PlaylistOptions
      follow={follow}
      mine={mine}
      followed={followed}
      uid={uid}
      myLists={profile.lists}
      name={name}
      shortLink={shortLink}
      description={description}
      activeKey={activeKey}
      setModal={actions.setModal}
      unfollow={unfollow} />
  )

  return (
    <Layout
      navigation={[{category: 'playlist', title: name}]}
      titleImg={imageUrl}
      titleActions={titleActions}>
      <Block mx='20px'>
        <Block p='15px' wide bgColor='white' border='1px solid #e0e0e0'>
          <Text color='#666' display='block' fs='m'>Description:</Text>
          {
            description
              ? <Description wide mt='10px' content={description} />
              : <Text display='block' mt='15px'>This playlist does not have a description yet.</Text>
          }
        </Block>
      </Block>
      <Menu mx='20px' column>
        <Block
          color='#999'
          mt='1em'
          fontWeight='800'
          align='start center'
          bgColor='transparent'
          p='8px 14px 8px 65px'
          mb='4px'>
          <Text flex minWidth='200px'>CHALLENGE NAME</Text>
          <Text minWidth='180px' w='180px'>ANIMAL</Text>
          <Text minWidth='180px' w='180px'>CODE TYPE</Text>
          <Block minWidth='180px' w='180px' />
        </Block>
        <PlaylistGameLoader
          myLists={profile.lists}
          dragTarget={dragTarget}
          dropTarget={target}
          listActions={{...actions, drop}}
          activeKey={activeKey}
          mine={mine}
          uid={uid}
          creatorID={creatorID}
          sequence={sequence} />
      </Menu>
      {modal && <LinkModal
        header='Share Code'
        code={modal}
        footer={modalFooter} />
      }
    </Layout>
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
    yield fbTask('follow_playlist', {
      uid,
      username,
      creatorID,
      creatorUsername,
      title: name,
      ref: activeKey
    })
    yield setToast(`followed ${name}`)
    yield sleep(3000)
    yield setToast('')
  }

  function * unfollow () {
    yield fbTask('unfollow_playlist', {
      uid,
      username,
      ref: activeKey
    })
    yield setToast(`unfollowed ${name}`)
    yield sleep(3000)
    yield setToast('')
  }
}

function getProps (props, context) {
  return {
    ...props,
    uid: context.uid,
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

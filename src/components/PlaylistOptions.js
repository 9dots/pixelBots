/** @jsx element */

import {Block, Dropdown, MenuItem} from 'vdux-containers'
import EditModal from '../components/EditModal'
import {setUrl} from 'redux-effects-location'
import ConfirmDelete from './ConfirmDelete'
import handleActions from '@f/handle-actions'
import createAction from '@f/create-action'
import validator from '../schema/playlist'
import {updatePlaylist} from '../actions'
import {Icon, Menu} from 'vdux-ui'
import {refMethod} from 'vdux-fire'
import element from 'vdux/element'
import {fbTask} from '../utils'
import Button from './Button'

const openModal = createAction('<PlaylistOptions/>: OPEN_MODAL')
const closeModal = createAction('<PlaylistOptions/>: CLOSE_MODAL')
const openEdit = createAction('<PlaylistOptions/>: OPEN_EDIT')
const closeEdit = createAction('<PlaylistOptions/>: CLOSE_EDIT')

const initialState = ({local}) => ({
  open: false,
  edit: false,
  actions: {
    openModal: local(openModal),
    closeModal: local(closeModal)
  }
})

function render ({props, state, local}) {
  const {
    activeKey,
    name,
    uid,
    setModal,
    unfollow,
    myLists = {},
    followed,
    follow,
    shortLink,
    mine,
    description
  } = props

  const {actions, open, edit} = state
  const onEdit = updatePlaylist(activeKey)

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
      onClick={unfollow}
      h='38px'
      bgColor='transparent'
      color='#666'
      border='1px solid #666'>Unfollow</Button>
    : <Button h='38px' bgColor='primary' onClick={follow}>Follow</Button>

  return (
    <Block align='center center'>
      <Button mr='5px' bgColor='blue' onClick={play}>
        <Icon ml='-6px' mr='8px' name='play_arrow' />
        Play
      </Button>
      <Button
        mr='5px'
        bgColor='green'
        onClick={(e) => setModal(shortLink)}>
        <Icon ml='-6px' mr='8px' name='link' />
        Share
      </Button>
      {followButton}
      {mine && <Dropdown btn={btn} zIndex='999'>
        <Menu w='150px' column zIndex='999'>
          <MenuItem
            fontWeight='300'
            onClick={local(() => openEdit({
              title: 'Title', name: 'name', value: name}))}>
            Edit Name
          </MenuItem>
          <MenuItem
            fontWeight='300'
            onClick={local(() => openEdit({
              title: 'Description', name: 'description', value: description
            }))}>
            Edit Description
          </MenuItem>
        </Menu>
      </Dropdown>}
      {open && <ConfirmDelete
        header='Unfollow Playlist?'
        message={`unfollow the playlist ${name}?`}
        dismiss={actions.closeModal}
        action={unfollow} />}
      {edit && <EditModal
        label={edit.title}
        field={edit.name}
        onSubmit={(val) => onEdit({
          [edit.name]: val[edit.name]
        })}
        name={edit.name}
        dismiss={local(closeEdit)}
        value={edit.value}
        validate={(val) => validator[edit.name](val[edit.name])}
        textarea={edit.name === 'description'}
      />}
    </Block>
  )

  function * play (e, anonymous = true) {
    if (!myLists[activeKey]) {
      const {key} = yield fbTask('create_playlist_instance', {
        playlistKey: activeKey,
        uid
      })
      yield refMethod({
        ref: `/queue/tasks/${key}`,
        updates: {method: 'once', value: 'child_removed'}
      })
    }
    yield setUrl(`/playSequence/${activeKey}`)
  }
}

const reducer = handleActions({
  [openModal.type]: (state) => ({...state, open: true}),
  [closeModal.type]: (state) => ({...state, open: false}),
  [openEdit.type]: (state, payload) => ({...state, edit: payload}),
  [closeEdit.type]: (state, payload) => ({...state, edit: false})
})

export default {
  initialState,
  reducer,
  render
}

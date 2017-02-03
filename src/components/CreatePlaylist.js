/** @jsx element */

import {Modal, ModalBody, ModalHeader, ModalFooter} from 'vdux-ui'
import {Input, Textarea} from 'vdux-containers'
import createAction from '@f/create-action'
import validator from '../schema/playlist'
import Button from '../components/Button'
import {refMethod} from 'vdux-fire'
import {setToast} from '../actions'
import element from 'vdux/element'
import {union} from 'lodash'
import sleep from '@f/sleep'
import Form from 'vdux-form'

const setText = createAction('SELECT TOOLBAR: SET_TEXT')
const setDescription = createAction('<CreatePlaylist/>: SET_DESCRIPTION')

const inputProps = {
  h: '42px',
  textIndent: '8px',
  borderRadius: '2px',
  border: '2px solid #ccc'
}

const modalProps = {
  position: 'fixed',
  left: '0',
  top: '0'
}

const initialState = () => ({
  modal: '',
  playlistName: '',
  playlistDescription: ''
})

function render ({props, local, state}) {
  const {uid, username, selected = [], handleDismiss = () => {}, onAddToPlaylist = () => {}} = props
  const {modal, playlistName, playlistDescription} = state

  return (
    <Modal color='#333' onDismiss={handleDismiss} overlayProps={modalProps}>
      <Form id='create-playlist' onSubmit={createPlaylist} validate={validator.playlist}>
        <ModalHeader fs='xl' py='1em'>Create a Playlist</ModalHeader>
        <ModalBody>
          <Input h='42px'
            name='playlistTitle'
            placeholder='Title'
            name='name'
            required
            inputProps={inputProps} />
          <Input h='42px'
            name='playlistDescription'
            placeholder='Description'
            name='description'
            required
            inputProps={inputProps} />
        </ModalBody>
        <ModalFooter>
          <Button onClick={handleDismiss} bgColor='secondary'>Cancel</Button>
          <Button form='create-playlist' type='submit' ml='1em' bgColor='primary'>Save</Button>
        </ModalFooter>
      </Form>
    </Modal>
  )

  function * createPlaylist ({name, description}) {
    yield refMethod({
      ref: '/queue/tasks',
      updates: {
        method: 'push',
        value: {
          _state: 'create_playlist',
          name,
          description,
          uid,
          username,
          selected
        }
      }
    })
    yield handleDismiss()
  }
}

function reducer (state, action) {
  switch (action.type) {
    case setText.type:
      return {
        ...state,
        playlistName: action.payload
      }
    case setDescription.type:
      return {
        ...state,
        playlistDescription: action.payload
      }
  }
  return state
}

function getProps (props, {username, currentUser}) {
  return {
    ...props,
    username,
    uid: currentUser.uid
  }
}

export default {
  getProps,
  initialState,
  reducer,
  render
}

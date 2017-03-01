/** @jsx element */

import {Block} from 'vdux-ui'
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
  const {playlistName, playlistDescription} = state

  return (
    <Block>
      <Form id='create-playlist' onSubmit={createPlaylist} validate={validator.playlist}>
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
        <Block align='end center' mt='1em'>
          <Button hoverProps={{color: 'blue', borderColor: 'blue'}} onClick={handleDismiss} color='#999' bgColor='transparent'>Cancel</Button>
          <Button form='create-playlist' type='submit' ml='6px' bgColor='blue'>Save</Button>
        </Block>
      </Form>
    </Block>
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
    yield onAddToPlaylist()
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

function getProps (props, {username, uid}) {
  return {
    ...props,
    username,
    uid: uid
  }
}

export default {
  getProps,
  initialState,
  reducer,
  render
}

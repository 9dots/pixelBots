/** @jsx element */

import IndeterminateProgress from '../../components/IndeterminateProgress'
import {Modal, ModalHeader, ModalBody, ModalFooter} from 'vdux-ui'
import {setUrl} from 'redux-effects-location'
import createAction from '@f/create-action'
import Button from '../../components/Button'
import fire, {refMethod} from 'vdux-fire'
import {createCode} from '../../utils'
import {Input} from 'vdux-containers'
import element from 'vdux/element'

const setLoading = createAction('<MyPlaylist/>: SET_LOADING')

const initialState = ({local}) => ({
  loading: false,
  actions: {
    setLoading: local(setLoading)
  }
})

const modalProps = {
  position: 'fixed',
  left: '0',
  top: '0'
}

const inputProps = {
  h: '42px',
  textIndent: '8px',
  borderRadius: '2px',
  border: '2px solid #ccc'
}

function * onUpdate (prev, {props, state}) {
  if (!state.loading && props.anonymous && props.playlist.value) {
    yield state.actions.setLoading()
    yield submit(props.playlist.value, props.ref, props.current)
  }
}

function render ({props, state}) {
  const {playlist} = props
  const {actions, loading} = state

  if (playlist.loading || loading) {
    return <IndeterminateProgress />
  }

  const listProps = playlist.value

  const modal = <Modal dismissOnClick={false} dismissOnEsc={false} overlayProps={modalProps}>
    <ModalHeader py='1em'>Enter Name</ModalHeader>
    <ModalBody>
      <Input inputProps={inputProps} />
    </ModalBody>
    <ModalFooter>
      <Button bgColor='primary' onClick={[actions.setLoading(), () => submit(listProps, props.ref, props.current, 'Daniel')]}>Save</Button>
    </ModalFooter>
  </Modal>

  return (
    <div>
      {!props.anonymous && modal}
    </div>
  )
}

function * submit (listProps, assignmentRef, current = 0, textVal = '') {
  // const saveIds = yield createSaveCodes(listProps.sequence.length)
  const code = yield createCode()
  const {key} = yield refMethod({
    ref: '/queue/tasks',
    updates: {
      method: 'push',
      value: {
        _state: 'create_playlist_instance',
        studentName: textVal,
        assignmentRef,
        listProps,
        current,
        code
      }
    }
  })

  yield refMethod({
    ref: `/queue/tasks/${key}`,
    updates: {method: 'once', value: 'child_removed'}
  })
  yield setUrl(`/${code}`, true)
}

function reducer (state, action) {
  switch (action.type) {
    case setLoading.type:
      return {
        ...state,
        loading: !state.loading
      }
  }
}

export default fire((props) => ({
  playlist: `/playlists/${props.ref}`
}))({
  initialState,
  onUpdate,
  reducer,
  render
})

/** @jsx element */

import element from 'vdux/element'
import ConfirmDelete from '../components/ConfirmDelete'
import {Block, IconButton} from 'vdux-containers'
import {abortRun} from '../middleware/codeRunner'
import {initializeGame} from '../actions'
import createAction from '@f/create-action'

const openModal = createAction('<Runner/>: OPEN_MODAL')
const closeModal = createAction('<Runner/>: CLOSE_MODAL')

const initialState = ({local}) => ({
  open: false,
  actions: {
    openModal: local(openModal),
    closeModal: local(closeModal)
  }
})

function render ({props, state}) {
  const {creatorMode, initialData} = props
  const {actions, open} = state

  const playButtons = (
    <Block w='180px' mr='1em'>
      <IconButton icon='delete_forever' tall flex bgColor='primary' wide fs='s' color='white' onClick={actions.openModal}>Start Over</IconButton>
    </Block>
  )
  return (
    <Block {...props} align='start center' hoverProps={{highlight: true}} transition='all .3s ease-in-out'>
      {
        creatorMode
          ? <Block wide tall/>
          : playButtons
      }
     {open && <ConfirmDelete header='Start Over?' message='start over? All of your code will be deleted.' dismiss={actions.closeModal} action={startOver}/>}
    </Block>
  )

  function * startOver () {
    yield abortRun('STOP')
    yield initializeGame({
      ...initialData,
      animals: initialData.animals.map((animal) => ({
        ...animal,
        sequence: []
      }))
    })
  }
}

function reducer (state, action) {
  switch (action.type) {
    case openModal.type:
      return {
        ...state,
        open: true
      }
    case closeModal.type:
      return {
        ...state,
        open: false
      }
  }
  return state
}

export default {
  initialState,
  reducer,
  render
}

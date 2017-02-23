
/** @jsx element */

import handleActions from '@f/handle-actions'
import createAction from '@f/create-action'
import EditLevel from '../pages/EditLevel'
import ModalMessage from './ModalMessage'
import Editor from '../pages/Editor'
import element from 'vdux/element'
import MenuItem from './MenuItem'
import {getLoc} from '../utils'
import {Block} from 'vdux-ui'
import Button from './Button'

const updateStartCode = createAction('<PermissionsField/>: UPDATE_START_CODE')
const showModal = createAction('<PermissionsField/>: SHOW_MODAL')
const hideModal = createAction('<PermissionsField/>: HIDE_MODAL')

const initialState = ({local, props}) => {
  return ({
    modal: false,
    startCode: props.game.startCode || '',
    actions: {
      hideModal: local(hideModal)
    }
  })
}

function render ({props, local, state}) {
  const {label, game, onSubmit, ...restProps} = props
  const {modal, startCode} = state

  const lineCount = getLoc(game.startCode)

  const footer = (
    <Block absolute top='1em' right='1em'>
      <Button ml='1em' bgColor='blue' onClick={[(e) => e.stopPropagation(), local(hideModal), saveStartCode]}>X</Button>
    </Block>
  )

  const body = <Block h='calc(100% - 1em)' relative align='center center'>
    <Block absolute top='0' left='0'>
      <EditLevel
        painted={game.targetPainted}
        grid='targetPainted'
        game={game}
        my='0'
        id='target-painted'
        size='200px'
      />
    </Block>
    <Editor
      minHeight='400px'
      active='0'
      creatorMode
      game={{
        ...game,
        permissions: ['EDIT_CODE'],
        animals: game.animals.map((animal) => ({...animal, sequence: game.startCode}))
      }}
      onChange={local(updateStartCode)}
      inputType={game.inputType}
    />
  </Block>

  return (
    <MenuItem
      align='center center'
      onClick={local(showModal)}
      label={label}
      value={`${lineCount} ${pluralize('line', lineCount)}`}
      {...restProps}>
      {modal && <ModalMessage
        minWidth='1200px'
        w='100%'
        h='100%'
        m='0'
        top='0'
        pt='5%'
        column
        headerColor='#666'
        bgColor='#FAFAFA'
        header={label}
        noFooter
        dismiss={saveStartCode}
        body={body}>
        {footer}
      </ModalMessage>
      }
    </MenuItem>
  )

  function * saveStartCode () {
    yield onSubmit(startCode)
  }
}

const pluralize = (noun, num) => num === 0 || num > 1 ? `${noun}s` : noun

const reducer = handleActions({
  [showModal.type]: (state) => ({...state, modal: true}),
  [hideModal.type]: (state) => ({...state, modal: false}),
  [updateStartCode.type]: (state, payload) => ({...state, startCode: payload})
})

export default {
  initialState,
  reducer,
  render
}

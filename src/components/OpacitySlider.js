/** @jsx element */

import handleActions from '@f/handle-actions'
import createAction from '@f/create-action'
import EditLevelModal from './EditLevelModal'
import {Block, Text} from 'vdux-ui'
import {setPaint} from '../actions'
import element from 'vdux/element'
import Slider from './Slider'

const hideModal = createAction('<OpacitySlider/>: HIDE_MODAL')
const showModal = createAction('<OpacitySlider/>: SHOW_MODAL')

const initialState = () => ({
  modal: false
})

function render ({props, state, local}) {
  const {opacity, onChange, game} = props
  const {permissions} = game
  const {modal} = state
  return (
    <Block align='space-around center'>
      <Slider
        startValue={opacity}
        w='220px'
        max='1'
        step='0.1'
        handleChange={onChange}
        name='opacity-slider' />
      {
        permissions.indexOf('Tracer Paint') > -1
          ? <Text cursor='pointer' color='blue' textDecoration='underline' onClick={local(showModal)}>GOAL</Text>
          : <Text fontWeight='300' userSelect='none'>GOAL</Text>
      }
      {modal && <EditLevelModal
        field='targetPainted'
        painted={game.targetPainted}
        colorPicker
        game={game}
        onSubmit={(painted) => setPaint({grid: 'targetPainted', painted})}
        dismiss={local(hideModal)}
        title='Click to paint the tracer image'/>}
    </Block>
  )
}

const reducer = handleActions({
  [showModal.type]: (state) => ({...state, modal: true}),
  [hideModal.type]: (state) => ({...state, modal: false})
})

export default {
  initialState,
  reducer,
  render
}

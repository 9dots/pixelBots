/** @jsx element */

import Controls from '../components/Controls'
import element from 'vdux/element'
import {codeAdded} from '../actions'
import reducer, {
  incrementLine,
	setActiveLine,
  removeLine,
  updateLine,
  selectLine,
  aceUpdate,
  addCode
} from '../reducer/editor'

const initialState = ({local, props, state}) => {
  const startCode = props.game.animals[0].sequence || []
  return {
    selectedLine: startCode.length,
    game: props.game,
    actions: {
      setActiveLine: props.setActiveLine ? props.setActiveLine : local(setActiveLine),
      removeLine: props.removeLine ? props.removeLine : local(removeLine),
      updateLine: props.updateLine ? props.updateLine : local(updateLine),
      incrementLine: props.incrementLine ? props.incrementLine : local(incrementLine),
      selectLine: props.selectLine ? props.selectLine : local(selectLine),
      aceUpdate: props.aceUpdate ? props.aceUpdate : local(aceUpdate),
      addCode: props.addCode ? props.addCode : local(addCode)
    }
  }
}

function * onUpdate (prev, next) {
  if (prev.state.game.animals[0].sequence !== next.state.game.animals[0].sequence) {
    yield next.props.onChange(next.state.game.animals[0].sequence)
  }
}

function render ({props, state}) {
  const {actions} = state
  const joinedProps = {...props, ...state.game}
  const editorActions = {...actions, codeAdded: () => codeAdded(state.selectedLine)}

  return (
    <Controls {...joinedProps} w='600px' selectedLine={state.selectedLine} editorActions={editorActions} />
  )
}

export default {
  initialState,
  onUpdate,
  reducer,
  render
}

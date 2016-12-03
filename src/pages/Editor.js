import Controls from '../components/Controls'
import element from 'vdux/element'
import reducer, {
  incrementLine,
	setActiveLine,
  removeLine,
  updateLine,
  selectLine,
  aceUpdate,
  addCode
} from '../reducer/editor'

const initialState = ({local, props}) => ({
	selectedLine: 0,
	actions: {
		setActiveLine: local(setActiveLine),
	  removeLine: props.removeLine ? props.removeLine : local(removeLine),
	  updateLine: props.updateLine ? props.updateLine : local(updateLine),
	  incrementLine: local(incrementLine),
	  selectLine: local(selectLine),
	  aceUpdate: props.aceUpdate ? props.aceUpdate : local(aceUpdate),
	  addCode: props.addCode ? props.addCode : local(addCode)
	}
})

function render ({props, state}) {
	const {actions, selectedLine} = state
	return (
		<Controls {...props} w='600px' selectedLine={selectedLine} editorActions={actions}/>
	)
}
    

export default {
	initialState,
	reducer,
	render
}
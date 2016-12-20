import handleActions from '@f/handle-actions'
import createAction from '@f/create-action'
import {Input} from 'vdux-containers'
import element from 'vdux/element'
import Window from 'vdux/window'
import {Block} from 'vdux-ui'

const toggleActive = createAction('<VduxSlider/>: TOGGLE_ACTIVE')
const setActive = createAction('<VduxSlider/>: SET_ACTIVE')
const setValue = createAction('<VduxSlider/>: SET_VALUE')

const relativePositionDecoder = (e) => (e.offsetX - 15) / (e.target.getBoundingClientRect().width - 30)
const roundToStep = (step) => (num) => (Math.round(num / step) * step)

const initialState = ({props, local}) => ({
	value: props.startValue || 0,
	active: false,
	actions: {
		toggleActive: local(toggleActive),
		setActive: local((val) => setActive(val)),
		setValue: local((val) => setValue(val))
	}
})

function render ({props, state}) {
	const {w = '300px', bgColor = 'blue', max = 100, name, step = 1, handleChange = () => {}, ...restProps} = props
	const {value = 0, active, actions} = state

	const percentage = (value / max) * 100
	const rounder = roundToStep(step)

	return (
		<Window onMouseUp={() => actions.setActive(false)}>
			<Block
				cursor='pointer'
				p='10px 15px'
				onMouseDown={[() => actions.setActive(true), (e) => handleNewValue(getValue(e))]}
				onMouseMove={active && ((e) => drag(getValue(e)))}
				onMouseUp={() => actions.setActive(false)}>
				<Block
					w={w}
					relative
					{...restProps}>
					<Block pointerEvents='none' wide h='2px' bgColor='darkgray'/>
					<Block pointerEvents='none' zIndex='1' h='2px' top='0px' absolute w={`${percentage}%`} bgColor={bgColor}/>
					<Block
						pointerEvents='none'
						boxShadow=''
						zIndex='2'
						left={`calc(${percentage}% - 3px)`}
						top='-5px'
						absolute
						circle='12px'
						transform={active ? 'scale(1.5)' : ''}
						transition='transform .2s ease-in-out'
						bgColor={bgColor}/>
					<Input m='0' h='0' visibility='hidden' name={name} value={value}/>
				</Block>
			</Block>
		</Window>
	)

	function * handleNewValue (val) {
		yield actions.setValue(val)
		yield handleChange(val)
	}

	function getValue (e) {
		const pos = relativePositionDecoder(e)
		return normalize(rounder(pos * max), max)
	}

	function * drag (x) {
		if (state.active) {
			const {max = '100'} = props
			if (x > max) {
				yield handleNewValue(max)
			} else if (x < 0) {
				yield handleNewValue(0)
			} else {
				yield handleNewValue(x)
			}
		}
	}
}

function normalize (val, max = 100, min = 0) {
	if (val < min) {
		return min
	} else if (val > max) {
		return max
	} else {
		return val
	}
}

function onCreate ({props}) {
	if (!props.name) {
		throw new Error('Missing `name` prop')
	}
}

const reducer = handleActions({
	[setValue]: (state, payload) => ({...state, value: payload}),
	[toggleActive]: (state, payload) => ({...state, active: !state.active, value: payload}),
	[setActive]: (state, payload) => ({...state, active: payload})
})

export default {
	initialState,
	onCreate,
	reducer,
	render
}
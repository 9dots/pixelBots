import IndeterminateProgress from '../components/IndeterminateProgress'
import {setUrl} from 'redux-effects-location'
import fire, {refMethod} from 'vdux-fire'
import {setSaveId} from '../actions'
import {createCode} from '../utils'
import element from 'vdux/element'
import omit from '@f/omit'
import Game from './Game'

function * onCreate ({props}) {
	if (props.saveID) {
	  return yield setSaveId(props.saveID)
	} else {
		const code = yield createCode()
		const saveRef = yield refMethod({
			ref: '/saved/',
			updates: {
				method: 'push',
				value: '0'
			}
		})
		yield refMethod({
			ref: `/links/${code}`,
			updates: {
				method: 'set',
				value: {
					type: 'saved',
					payload: {
						saveRef: `${saveRef.key}`,
						gameRef: `${props.gameCode}`
					}
				}
			}
		})
		yield setUrl(`/${code}`)
	}
}

function * onUpdate (prev, {props}) {
  if (props.saveID !== prev.props.saveID) {
    yield setSaveId(props.saveID)
  }
}

function render ({props}) {
	const {gameVal, savedProgress} = props
	if (gameVal.loading || savedProgress.loading) {
		return <IndeterminateProgress/>
	}

	const mergeGameData = {...gameVal.value, ...savedProgress.value}

	return (
		<Game initialData={mergeGameData} {...omit(['gameVal, savedProgress'], props)} left='60px'/>
	)
}

export default fire((props) => ({
  gameVal: `/games/${props.gameCode}`,
  savedProgress: `/saved/${props.saveID}`
}))({
	onCreate,
	onUpdate,
  render
})
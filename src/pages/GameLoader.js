import IndeterminateProgress from '../components/IndeterminateProgress'
import {setUrl} from 'redux-effects-location'
import fire, {refMethod} from 'vdux-fire'
import {setSaveId, setGameId} from '../actions'
import {createCode} from '../utils'
import element from 'vdux/element'
import omit from '@f/omit'
import Game from './Game'

function * onCreate ({props}) {
	if (props.noSave) {
		yield setGameId(props.gameCode)
		yield setSaveId(null)
		return
	}
	if (props.saveID) {
		yield setGameId(props.gameCode)
	  return yield setSaveId(props.saveID)
	} else {
		const code = yield createCode()
		const saveRef = yield refMethod({
			ref: '/saved/',
			updates: {
				method: 'push',
				value: ''
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
  if (!props.noSave && props.saveID !== prev.props.saveID) {
    yield setSaveId(props.saveID)
  }
}

function render ({props}) {
	const {gameVal, savedProgress} = props
	if (gameVal.loading || (props.saveID && savedProgress.loading)) {
		return <IndeterminateProgress/>
	}

	const mergeGameData = {...gameVal.value, ...savedProgress.value}

	return (
		<Game initialData={mergeGameData} {...omit(['gameVal, savedProgress'], props)} left='60px'/>
	)
}

export default fire((props) => {
	const savedProgress = props.saveID ? `/saved/${props.saveID}` : null
	return {
 		savedProgress,
		gameVal: `/games/${props.gameCode}`
	}
})({
	onCreate,
	onUpdate,
  render
})
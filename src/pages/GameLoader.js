import IndeterminateProgress from '../components/IndeterminateProgress'
import {setUrl} from 'redux-effects-location'
import fire, {refMethod} from 'vdux-fire'
import {setSaveId, setGameId} from '../actions'
import {createCode} from '../utils'
import Layout from '../layouts/HeaderAndBody'
import {Block, Text} from 'vdux-ui'
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
    yield createNewSave(props.gameCode)
  }
}

function * onUpdate (prev, {props}) {
  if (!props.noSave && props.saveID !== prev.props.saveID) {
    yield setSaveId(props.saveID)
  }
}

function render ({props}) {
  const {gameVal, savedProgress, playlist} = props
  if (gameVal.loading || (props.saveID && savedProgress.loading)) {
    return <IndeterminateProgress />
  }

  const mergeGameData = {...gameVal.value, ...savedProgress.value}
  const game = <Game
    mine={props.mine}
    initialData={mergeGameData}
    gameData={gameVal.value}
    {...omit(['gameVal, savedProgress'], props)}
    left='60px' />
  const gameLayout = <Layout
    category='challenge'
    title={mergeGameData.title}
    titleImg={mergeGameData.imageUrl}>
    {game}
  </Layout>

  return playlist ? game : gameLayout
}

function * createNewSave (gameCode) {
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
          gameRef: `${gameCode}`
        }
      }
    }
  })
  yield setUrl(`/${code}`, true)
}

export default fire((props) => {
  const savedProgress = props.saveID ? `/saved/${props.saveID}` : null
  return {
    gameVal: `/games/${props.gameCode}`,
 		savedProgress
  }
})({
  onCreate,
  onUpdate,
  render
})

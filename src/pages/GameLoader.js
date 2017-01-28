import IndeterminateProgress from '../components/IndeterminateProgress'
import {setUrl} from 'redux-effects-location'
import fire, {refMethod} from 'vdux-fire'
import {setSaveId, setGameId} from '../actions'
import handleActions from '@f/handle-actions'
import createAction from '@f/create-action'
import {createCode} from '../utils'
import Layout from '../layouts/HeaderAndBody'
import element from 'vdux/element'
import omit from '@f/omit'
import Game from './Game'

const setLoading = createAction('<GameLoader/>: SET_LOADING')

const initialState = ({local}) => ({
  loading: true,
  actions: {
    setLoading: local(setLoading)
  }
})

function * onCreate ({props, state}) {
  if (props.noSave) {
    yield state.actions.setLoading()
    yield setGameId(props.gameCode)
    yield setSaveId(null)
    return
  }
  if (props.saveID) {
    yield state.actions.setLoading()
    yield setGameId(props.gameCode)
    return yield setSaveId(props.saveID)
  } else {
    yield createNewSave(props.gameCode)
  }
}

function * onUpdate (prev, next) {
  if (!next.props.noSave && next.props.saveID !== prev.props.saveID) {
    yield setSaveId(next.props.saveID)
  }
}

function render ({props, state}) {
  const {gameVal, savedProgress, playlist} = props
  const {actions, loading} = state

  if (gameVal.loading || (props.saveID && savedProgress.loading) || loading) {
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

const reducer = handleActions({
  [setLoading.type]: (state) => ({...state, loading: false})
})

export default fire((props) => {
  const savedProgress = props.saveID ? `/saved/${props.saveID}` : null
  return {
    gameVal: `/games/${props.gameCode}`,
 		savedProgress
  }
})({
  initialState,
  onCreate,
  onUpdate,
  reducer,
  render
})

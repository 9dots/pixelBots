/** @jsx element */

import {runCode, abortRun, pauseRun, resume} from '../middleware/codeRunner'
import handleActions from '@f/handle-actions'
import createAction from '@f/create-action'
import Loading from '../components/Loading'
import {initializeGame, reset, setSpeed} from '../actions'
import Level from '../components/Level'
import element from 'vdux/element'
import {Block} from 'vdux-ui'
import sleep from '@f/sleep'
import fire from 'vdux-fire'

const gameIsReady = createAction('<SharedProject/>: GAME_IS_READY')

const initialState = ({local}) => ({
  ready: false,
  gameIsReady: local(gameIsReady)
})

function * runContinuous () {
  yield runCode(function * () {
    yield sleep(1000)
    yield reset()
    yield runContinuous()
  })
}

function * onUpdate (prev, next) {
  if (!next.state.ready && !next.props.gameVal.loading && !next.props.savedGame.loading) {
    const mergeGameData = {...next.props.gameVal.value, ...next.props.savedGame.value}
    yield initializeGame(mergeGameData)
    yield setSpeed(1000)
    yield next.state.gameIsReady()
    yield sleep(500)
    yield runContinuous()
  }
}

function render ({props, state}) {
  if (!state.ready) {
    return <Loading/>
  }
  const {game, speed} = props
  const {animals, painted, levelSize} = game

  return (
    <Block wide tall align='center center'>
      <Block sq='600px'>
        <Level
          hasRun
          running
          active={0}
          hideBorder
          animals={[]}
          painted={painted}
          speed={speed}
          levelSize='600px'
          numRows={levelSize[0]}
          numColumns={levelSize[1]} />
      </Block>
    </Block>
  )
}

function * onRemove () {
  yield abortRun()
  yield reset()
  yield setSpeed(1)
}

const reducer = handleActions({
  [gameIsReady.type]: (state) => ({...state, ready: true})
})

export default fire((props) => ({
  gameVal: `/games/${props.gameCode}`,
  savedGame: `/saved/${props.saveID}`
}))({
  initialState,
  onRemove,
  onUpdate,
  reducer,
  render
})

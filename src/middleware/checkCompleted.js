/** @jsx element */

import {animalPaint, reset, setModalMessage} from '../actions'
import element from 'vdux/element'
import {Block, Text} from 'vdux-ui'
import {abortRun} from './codeRunner'
import objEqual from '@f/equal-obj'
import {getLoc} from '../utils'
import filter from '@f/filter'
import {createIterators, run} from '../runner'
import createAction from '@f/create-action'

const checkDrawing = createAction('<checkCompleted/>: CHECK_DRAWING')

function winMessage (msg) {
  const body = <Block>
    <Text>{msg}</Text>
  </Block>

  return {
    header: 'Congratulations',
    type: 'win',
    body
  }
}

function loseMessage (msg) {
  const body = <Block>
    <Text>{msg}</Text>
  </Block>

  return {
    header: 'Keep Trying',
    body
  }
}

// You wrote {loc} lines of code to draw this picture!
// getLoc(game.animals[0].sequence))

export default ({getState, dispatch}) => (next) => (action) => {
  if (action.type === animalPaint.type) {
    const result = next(action)
    const {game} = getState()
    if (checkCorrect(game)) {
      const loc = getLoc(game.animals[0].sequence)
      handleCorrect(`You wrote ${loc} lines of code to draw this picture!`)
    }
    return result
  }
  if (action.type === checkDrawing.type) {
    const {game} = getState()
    const {animals} = game

    createIterators(animals)
      .then((its) => its.map((it) => {
        return run(it, animals, () => 2000, (val) => dispatch(val), (e) => console.warn(e), onComplete).run()
      }))

    function onComplete () {
      const {game} = getState()
      if (checkCorrect(game)) {
        handleCorrect(`You drew the correct picture!`)
      } else {
        dispatch(setModalMessage(loseMessage('The picture does not match the code.')))
      }
      dispatch(reset())
    }

  }
  return next(action)

  function handleCorrect (msg) {
    setTimeout(function () {
      dispatch(abortRun('STOP'))
      dispatch(setModalMessage(winMessage(msg)))
    }, 800)
  }
}

function checkCorrect (game) {
  if (game.targetPainted) {
    if (objEqual(filter(filterWhite, game.targetPainted), filter(filterWhite, game.painted))) {
      return true
    }
  }
  return false
}

function filterWhite (square) {
  return square !== 'white'
}

export {
  checkDrawing
}

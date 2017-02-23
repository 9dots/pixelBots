/** @jsx element */

import {animalPaint, reset, setModalMessage, completeChallenge} from '../actions'
import {createIterators, run} from '../runner'
import createAction from '@f/create-action'
import {getLoc, fbTask} from '../utils'
import {abortRun, incrementSteps} from './codeRunner'
import {Block, Text} from 'vdux-ui'
import objEqual from '@f/equal-obj'
import element from 'vdux/element'
import filter from '@f/filter'

const completeProject = createAction('<checkCompleted/>: COMPLETE_PROJECT')
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
  if (action.type === completeProject.type) {
    const {animals} = getState().game
    createIterators(animals)
      .then((its) => its.map((it) => {
        return run(it, animals, () => 2000, onValue, (e) => console.warn(e), handleCorrect).run()
      }))
  }
  return next(action)

  function onValue (action) {
    dispatch(incrementSteps())
    return dispatch(action)
  }

  function handleCorrect (msg) {
    setTimeout(function () {
      const {gameID, saveID, game, user} = getState()
      dispatch(abortRun('STOP'))
      dispatch(completeChallenge(gameID, saveID, user.uid, game))
      dispatch(fbTask('create_gif', {
        frames: game.frames.concat(game.painted),
        saveID: saveID,
        gridSize: game.levelSize[0]
      }))
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
  checkDrawing,
  completeProject
}

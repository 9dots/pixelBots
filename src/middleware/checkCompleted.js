/** @jsx element */

import {animalPaint, setModalMessage} from '../actions'
import element from 'vdux/element'
import {Block, Text} from 'vdux-ui'
import {abortRun} from './codeRunner'
import objEqual from '@f/equal-obj'
import {getLoc} from '../utils'
import filter from '@f/filter'

function winMessage (loc) {
  const body = <Block>
    <Text>You wrote {loc} lines of code to draw this picture!</Text>
  </Block>

  return {
    header: 'Congratulations',
    type: 'win',
    body
  }
}

export default ({getState, dispatch}) => (next) => (action) => {
  if (action.type === animalPaint.type) {
    const result = next(action)
    const {game} = getState()

    if (game.targetPainted) {
      if (objEqual(filter(filterWhite, game.targetPainted), filter(filterWhite, game.painted))) {
        setTimeout(function () {
          dispatch(abortRun('STOP'))
          dispatch(setModalMessage(winMessage(getLoc(game.animals[0].sequence))))
        }, 800)
      }
    }
    return result
  }
  return next(action)
}

function filterWhite (square) {
  return square !== 'white'
}

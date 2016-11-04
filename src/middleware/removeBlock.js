import {removeLine} from '../actions'

export default ({getState, dispatch}) => (next) => (action) => {
  if (action.type === removeLine.type) {
    const {id, idx, type} = action.payload
    if (!type) return next(action)
    const {sequence} = getState().game.animals[id]
    dispatch(removeLine(id, findMatchingBrace(sequence, idx) + idx))
  }
  return next(action)
}

function findMatchingBrace (code, startingIdx) {
  let numOpen = 0
  return code.slice(startingIdx, code.length).findIndex((line) => {
    if (line.search(/\{/) > -1) { numOpen++ }
    if (line.trim() === '}') { numOpen-- }
    return numOpen === 0
  })
}

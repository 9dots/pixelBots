import {addFrame, animalPaint, paintSquare} from '../actions'

export default function () {
  return ({getState, dispatch}) => (next) => (action) => {
    if (action.type === paintSquare.type) {
      const {id, getPaintColor} = action.payload
      const newColor = getPaintColor(getState(), id)
      dispatch(animalPaint(id, newColor))
  		const result = next(action)
  		console.log(result)
      dispatch(addFrame())
    }
    return next(action)
  }
}

import {addCode} from '../actions'
import {scrollTo} from './scroll'

export default function ({dispatch, getState}) {
  return (next) => (action) => {
    if (action.type === addCode.type) {
      let {selectedLine, active, animals} = getState()
      selectedLine = selectedLine || animals[active].sequence.length
      setTimeout(function () {
        dispatch(scrollTo('.code-editor', `#code-icon-${selectedLine}`))
      }, 50)
    }
    return next(action)
  }
}

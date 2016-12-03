import {addCode, aceUpdate, updateLine, removeLine} from './editor'
import splice from '@f/splice'
import setProp from '@f/set-prop'
import createAction from '@f/create-action'

const setFillColor = createAction('<DrawLevel/>: SET_FILL_COLOR')
const addPainted = createAction('<DrawLevel/>: ADD_PAINTED')
const showID = createAction('<DrawLevel/>: SHOW_ID')
const hasSaved = createAction('<DrawLevel/>: HAS_SAVED')
const next = createAction('<DrawLevel/>: NEXT')
const back = createAction('<DrawLevel/>: BACK')

function reducer (state, action) {
  switch (action.type) {
    case setFillColor.type:
      return {
        ...state,
        color: action.payload
      }
    case addPainted.type:
      const {grid, coord} = action.payload
      return {
        ...state,
        painted: setProp(
            grid,
            state.painted,
            {...state.painted[grid], [coord]: state.painted[grid][coord] === state.color ? 'white' : state.color}
          )
      }
    case showID.type:
      return {
        ...state,
        show: action.payload
      }
    case hasSaved.type:
      return {
        ...state,
        hasSaved: true
      }
    case next.type:
      return {
        ...state,
        slide: state.slide + 1
      }
    case back.type:
      return {
        ...state,
        slide: state.slide - 1
      }
    case addCode.type:
      var {id, code, idx} = action.payload
      var lineNum = idx || typeof (state.selectedLine) === 'number'
        ? state.selectedLine
        : null
      return {
        ...state,
        selectedLine: state.selectedLine + 1,
        sequence: splice(state.sequence || '', lineNum, 0, code)
      }
    case removeLine.type:
      var {id, idx} = action.payload
      return {
        ...state,
        sequence: state.sequence.filter((line, i) => i !== idx)
      }
    case aceUpdate.type:
      var {id, code} = action.payload
      return {
        ...state,
        sequence: code
      }
    case updateLine.type:
      var {id, lineNum, code} = action.payload
      return {
        ...state,
        sequence: splice(state.sequence, lineNum, 1, code)
      }
  }
  return state
}

export {
  setFillColor,
  addPainted,
  hasSaved,
  showID,
  next,
  back
}

export default reducer
import splice from '@f/splice'
import setProp from '@f/set-prop'
import {arrayAt} from '../utils'
import createAction from '@f/create-action'

const setActiveLine = createAction('EDITOR: SET_ACTIVE_LINE')
const removeLine = createAction('EDITOR: REMOVE_LINE')
const updateLine = createAction('EDITOR: UPDATE_LINE')
const selectLine = createAction('EDITOR: SELECT_LINE')
const aceUpdate = createAction('EDITOR: ACE_UPDATE')
const addCode = createAction('EDITOR: CREATE_CODE')
const incrementLine = createAction('EDITOR: INCREMENT_LINE')

function reducer (state, action) {
  switch (action.type) {
    case selectLine.type:
      var {id, idx} = action.payload
      return {
        ...state,
        selectedLine: idx
      }
    case addCode.type:
      var {id, code, idx} = action.payload
      var lineNum = idx || typeof (state.selectedLine) === 'number'
        ? state.selectedLine
        : null
      return {
        ...state,
        game: arrayAt(setProp(
          `animals.${id}.sequence`,
          state.game,
          splice(state.game.animals[id].sequence || [], lineNum, 0, code)
        ), 'animals')
      }
    case incrementLine.type: {
      return {
        ...state,
        selectedLine: state.selectedLine + 1
      }
    }
    case removeLine.type:
      var {id, idx} = action.payload
      var sequence = state.game.animals[id].sequence
      var sl = state.selectedLine >= sequence.length
        ? sequence.length - 1
        : state.selectedLine

      return {
        ...state,
        selectedLine: sl,
        game: arrayAt(setProp(
          `animals.${id}.sequence`,
          state.game,
          state.game.animals[id].sequence.filter((line, i) => i !== idx)
        ), 'animals')
      }
    case setActiveLine.type:
      return {
        ...state,
        activeLine: action.payload
      }
    case aceUpdate.type:
      var {id, code} = action.payload
      return {
        ...state,
        game: arrayAt(setProp(
          `animals.${id}.sequence`,
          state.game,
          code
        ), 'animals')
      }
    case updateLine.type:
      var {id, lineNum, code} = action.payload
      return {
        ...state,
        game: arrayAt(setProp(
          `animals.${id}.sequence`,
          state.game,
          splice(state.game.animals[id].sequence, lineNum, 1, code)
        ), 'animals')
      }
  }
  return state
}

export {
  setActiveLine,
  removeLine,
  incrementLine,
  updateLine,
  selectLine,
  aceUpdate,
  addCode
}

export default reducer

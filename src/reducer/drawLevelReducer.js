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
      const {coord} = action.payload
      return {
        ...state,
        painted: setProp(
          coord.join(','),
          state.painted,
          state.painted[coord] === state.color ? 'white' : state.color
        )
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

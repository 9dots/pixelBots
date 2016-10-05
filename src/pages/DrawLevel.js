/** @jsx element */

import element from 'vdux/element'
import {Block} from 'vdux-ui'
import {Button} from 'vdux-containers'
import {setUrl} from 'redux-effects-location'
import Level from '../components/Level'
import createAction from '@f/create-action'

const setRows = createAction('SET_ROWS')
const setColumns = createAction('SET_COLUMNS')

function initialState () {
  return {
    rows: 5,
    columns: 5
  }
}

function render ({props, state}) {
  const {rows, columns} = state
  return (
    <Block>
      Select Level
      <Level
        editMode
        painted={[]}
        levelSize='500px'
        numRows={rows}
        numColumns={columns}/>
      <Button onClick={() => setUrl('/')}>Save</Button>
    </Block>
  )
}

function reducer (state, action) {
  switch (action.type) {
    case setRows.type:
      return {
        ...state,
        rows: action.payload
      }
    case setColumns.type:
      return {
        ...state,
        columns: action.payload
      }
  }
  return state
}

export default {
  initialState,
  reducer,
  render
}

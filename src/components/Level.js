/** @jsx element */

import element from 'vdux/element'
import {Flex} from 'vdux-ui'
import Row from './Row'
import Animal from './Animal'
import reduce from '@f/reduce'
import Window from 'vdux/window'
import createAction from '@f/create-action'

const dragStart = createAction('<Level/>: DRAG_START')
const dragEnd = createAction('<Level/>: DRAG_END')

const initialState = () => ({
  dragging: false
})

function render ({props, local, state}) {
  let {
    clickHandler = () => {},
    hideBorder = false,
    numColumns = 5,
    painted = [],
    numRows = 5,
    levelSize,
    paintMode,
    editMode,
    animals,
    running,
    active,
    grid,
    w = '100%',
    h = '100%'
  } = props
  const {dragging} = state

  const size = parseFloat(levelSize) / numRows + 'px'

  return (
    <Window onMouseUp={local(dragEnd)}>
      <Flex
        w={w}
        h={h}
        relative
        column
        onMouseDown={paintMode && local(dragStart)}
        onMouseUp={paintMode && local(dragEnd)}>
        {getRows({...props, size, dragging, clickHandler})}
        {animals.map((animal, i) => (
          <Animal
            running={running}
            editMode={editMode}
            cellSize={size}
            active={active}
            animal={animal}
            id={i}/>
        ))}
      </Flex>
    </Window>
  )
}

function getRows ({painted, numRows, ...restProps}) {
  let rows = []
  for (var i = 0; i < numRows; i++) {
    rows.push(
      <Row
        {...restProps}
        numRows={numRows}
        row={i}
        painted={getPainted(i, painted)}/>
    )
  }
  return rows
}

function getPainted (idx, painted) {
  return reduce((cur, next, key) => {
    const loc = key.split(',').map((num) => Number(num))
    if (idx === loc[0]) {
      cur[loc[1]] = next
    }
    return cur
  }, {}, painted)
}

function reducer (state, action) {
  switch (action.type) {
    case dragStart.type:
      return {
        ...state,
        dragging: true
      }
    case dragEnd.type:
      return {
        ...state,
        dragging: false
      }
  }
  return state
}

export default {
  initialState,
  reducer,
  render
}

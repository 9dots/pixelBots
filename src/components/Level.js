/** @jsx element */

import element from 'vdux/element'
import {Block, Flex} from 'vdux-ui'
import Row from './Row'
import Animal from './Animal'
import reduce from '@f/reduce'
import Window from 'vdux/window'
import createAction from '@f/create-action'
import animalApis from '../animalApis'

const dragStart = createAction('<Level/>: DRAG_START')
const dragEnd = createAction('<Level/>: DRAG_END')

const initialState = () => ({
  dragging: false
})

function render ({props, local, state, children}) {
  let {
    clickHandler = () => {},
    numRows = 5,
    levelSize,
    paintMode,
    editMode,
    animals,
    hasRun,
    running,
    active,
    w = '100%',
    h = '100%',
    speed,
    id
  } = props
  const {dragging} = state

  const size = parseFloat(levelSize) / numRows + 'px'
  const thisAnimal = animals[0] ? animalApis[animals[0].type] : undefined
  const animationSpeed = thisAnimal
    ? (thisAnimal.speed * (1 / speed)) / 1000
    : 0.75

  return (
    <Window onMouseUp={local(dragEnd)}>
      <Block
        w={w}
        h={h}
        relative
        id={id}
        onMouseDown={paintMode && local(dragStart)}
        onMouseUp={paintMode && local(dragEnd)}>
        {getRows({...props, size, dragging, clickHandler, animationSpeed})}
        {animals.map((animal, i) => (
          <Animal
            hasRun={hasRun}
            running={running}
            editMode={editMode}
            animationSpeed={animationSpeed}
            cellSize={size}
            active={active}
            animal={animal}
            id={i}/>
        ))}
        {children}
      </Block>
    </Window>
  )
}

function getRows ({painted, numRows, running, animals, ...restProps}) {
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

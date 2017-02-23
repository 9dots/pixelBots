/** @jsx element */

import {Block} from 'vdux-ui'
import Level from '../components/Level'
import element from 'vdux/element'

function render ({props, children}) {
  const {
    clickHandler = () => {},
    color = 'black',
    size = '500px',
    hideAnimal,
    my = '1em',
    paintMode,
    painted,
    grid,
    game,
    id,
    ...restProps
  } = props

  return (
    <Block my={my} textAlign='center' border='1px solid #e0e0e0'>
      {children}
      <Level
        editMode
        paintMode={paintMode}
        grid={grid}
        id={id}
        animals={hideAnimal ? [] : game.animals}
        painted={painted}
        levelSize={size}
        color={color}
        w='auto'
        h='auto'
        clickHandler={(coord) => clickHandler({grid, coord, color})}
        numRows={game.levelSize[0]}
        numColumns={game.levelSize[1]}
        {...restProps} />
    </Block>
  )
}

export default {
  render
}

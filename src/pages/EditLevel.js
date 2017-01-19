/** @jsx element */

import {Block} from 'vdux-ui'
import Level from '../components/Level'
import element from 'vdux/element'

function render ({props, children}) {
  const {
    clickHandler = () => {},
    size = '500px',
    hideAnimal,
    paintMode,
    painted,
    color = 'black',
    grid,
    game,
    my = '1em',
    id,
    ...restProps
  } = props

  return (
    <Block my={my} textAlign='center'>
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
        {...restProps}>
      </Level>
    </Block>
  )
}

export default {
  render
}

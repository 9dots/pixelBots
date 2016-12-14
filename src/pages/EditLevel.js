import ColorPicker from '../components/ColorPicker'
import Button from '../components/Button'
import {Block, Card, Text} from 'vdux-ui'
import Level from '../components/Level'
import element from 'vdux/element'

function render ({props}) {
  const {game, id, painted, paintMode, clickHandler = () => {}, title, grid, size = '500px', ...restProps} = props

  return (
    <Block my='1em' textAlign='center'>
      <Level
        editMode
        paintMode={paintMode}
        grid={grid}
        id={id}
        animals={game.animals.map((animal) => convertToStar(animal))}
        painted={painted}
        levelSize={size}
        w='auto'
        h='auto'
        clickHandler={(coord) => clickHandler({grid, coord})}
        numRows={game.levelSize[0]}
        numColumns={game.levelSize[1]}
        {...restProps}/>
    </Block>
  )
}

function convertToStar (animal) {
  return {
    type: 'star',
    current: animal.initial
  }
}

export default {
  render
}
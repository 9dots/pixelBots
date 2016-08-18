/** @jsx element */

import element from 'vdux/element'
import {Block} from 'vdux-ui'
import Level from './components/Level'
import Controls from './components/Controls'

function render (props) {
  const {levelSize, animals, painted, active, running, activeLine, selectedLine} = props
  let height = '550px'

  return (
    <Block m='60px' align='center start' bgColor='white' h={height}>
      <Level animals={animals} height={height} active={active} painted={painted} numRows={levelSize[0]} numColumns={levelSize[1]}/>
      <Controls selectedLine={selectedLine} activeLine={activeLine} running={running} active={active} animals={animals}/>
    </Block>
  )
}

export default render

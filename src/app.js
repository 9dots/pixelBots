import element from 'vdux/element'
import {Block} from 'vdux-ui'
import Level from './components/Level'
import Controls from './components/Controls'

function render (props) {
  const {levelSize, turtles, painted, active, running, activeLine} = props
  let height = '600px'

  return (
    <Block m='60px' align='center start' bgColor='white' h={height}>
      <Level height={height} active={active} painted={painted} turtles={turtles} numRows={levelSize[0]} numColumns={levelSize[1]}/>
      <Controls activeLine={activeLine} running={running} active={active} turtles={turtles}/>
    </Block>
  )
}

export default render

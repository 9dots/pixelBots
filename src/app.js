import element from 'vdux/element'
import {Block} from 'vdux-ui'
import Level from './components/Level'
import {turtleForward, turtleTurnRight, turtlePaint} from './actions'

function render (props) {
  const {levelSize, turtles, painted} = props

  return (
    <Block align='center center'>
      <Level painted={painted} turtles={turtles} numRows={levelSize[0]} numColumns={levelSize[1]}/>
      <button onClick={() => turtleForward(1)}>Forward</button>
      <button onClick={() => turtleTurnRight(1)}>Turn Right</button>
      <button onClick={() => turtlePaint(1)}>Turtle Paint</button>
    </Block>
  )
}

export default render

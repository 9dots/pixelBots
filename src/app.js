/** @jsx element */

import element from 'vdux/element'
import {Block} from 'vdux-ui'
import Level from './components/Level'
import Controls from './components/Controls'
import Header from './components/Header'

function render (props) {
  const {levelSize, animals, painted, active, running, activeLine, selectedLine} = props
  let height = '400px'

  return (
    <Block bgColor='#e5e5e5' relative align='center start' tall wide>
      <Header h='60px' absolute top='0' left='0' right='0' title='Pixel Bots'/>
      <Block absolute top='60px' h='calc(100% - 60px)' wide align='center start'>
        <Block pt='20px' px='20px'>
          <Level animals={animals} height={height} active={active} painted={painted} numRows={levelSize[0]} numColumns={levelSize[1]}/>
        </Block>
        <Controls selectedLine={selectedLine} activeLine={activeLine} running={running} active={active} animals={animals}/>
      </Block>
    </Block>
  )
}

export default render

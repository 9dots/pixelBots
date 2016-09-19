/** @jsx element */

import element from 'vdux/element'
import {Block} from 'vdux-ui'
import Level from './components/Level'
import Controls from './components/Controls'
import Header from './components/Header'
import ErrorMessage from './components/ErrorMessage'

function render (props) {
  const {levelSize, animals, painted, active, running, activeLine, selectedLine, hasRun, error, inputType} = props
  let height = '600px'

  return (
    <Block bgColor='#e5e5e5' relative align='center start' tall wide>
      <Header h='60px' absolute top='0' left='0' right='0' title='Pixel Bots'/>
      <Block absolute top='60px' h='calc(100% - 60px)' wide align='center start'>
        <Block pt='20px' px='20px'>
          <Level animals={animals} height={height} active={active} painted={painted} numRows={levelSize[0]} numColumns={levelSize[1]}/>
        </Block>
        <Controls inputType={inputType} hasRun={hasRun} selectedLine={selectedLine} activeLine={activeLine} running={running} active={active} animals={animals}/>
      </Block>
      {error && <ErrorMessage message={error} lineNumber={activeLine + 1}/>}
    </Block>
  )
}

export default render

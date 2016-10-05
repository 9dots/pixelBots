/** @jsx element */

import ErrorMessage from '../components/ErrorMessage'
import Controls from '../components/Controls'
import Level from '../components/Level'
import element from 'vdux/element'
import {Block, Box} from 'vdux-ui'

function render ({props}) {
  const {
    selectedLine,
    activeLine,
    inputType,
    running,
    active,
    hasRun,
    error,
    game,
    top
  } = props

  const {
    levelSize,
    painted,
    animals
  } = game

  const size = '550px'

  return (
    <Block bgColor='#e5e5e5' relative h='calc(100% - 60px)' wide top={top}>
      <Block
        relative
        display='flex'
        left='0'
        minHeight='100%'
        wide>
        <Block h={size} w={size} my='20px' mx='20px'>
          <Level
            animals={animals}
            active={active}
            painted={painted}
            levelSize={size}
            numRows={levelSize[0]}
            numColumns={levelSize[1]}/>
        </Block>
        <Box tall style={{flex: 1}}>
          <Controls
            selectedLine={selectedLine}
            activeLine={activeLine}
            inputType={inputType}
            running={running}
            hasRun={hasRun}
            active={active}
            animals={animals}/>
        </Box>
      </Block>
      {error && <ErrorMessage message={error} lineNumber={activeLine + 1}/>}
    </Block>
  )
}

export default {
  render
}

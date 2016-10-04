/** @jsx element */

import ErrorMessage from '../components/ErrorMessage'
import Controls from '../components/Controls'
import Header from '../components/Header'
import {initializeApp} from '../actions'
import Level from '../components/Level'
import element from 'vdux/element'
import {Block, Box} from 'vdux-ui'
import Button from '../components/Button'

function onCreate () {
  return initializeApp()
}

function render ({props}) {
  const {
    painted,
    levelSize,
    animals,
    active,
    running,
    activeLine,
    selectedLine,
    hasRun,
    error,
    inputType
  } = props

  const size = '550px'

  return (
    <Block bgColor='#e5e5e5' relative align='center start' tall wide>
      <Header h='60px' absolute top='0' left='0' right='0' title='Pixel Bots'>
        <Button>Create</Button>
      </Header>
      <Block
        absolute
        top='60px'
        h='calc(100% - 60px)'
        left='0'
        wide align='center start'>
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
  onCreate,
  render
}

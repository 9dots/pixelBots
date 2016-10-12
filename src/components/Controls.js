/** @jsx element */

import element from 'vdux/element'
import {Block, Box, Text, MenuItem} from 'vdux-containers'
import Buttons from './Buttons'
import CodeBox from './CodeBox'
import Runner from './Runner'
import Code from './Code'
import Tab from './Tab'

function render ({props}) {
  const {
    active,
    animals,
    running,
    selectedLine,
    hasRun,
    inputType,
    onRun
  } = props
  const sequence = animals[active].sequence || []

  return (
    <Block
      minHeight='600px'
      boxShadow='0 0 2px 1px rgba(0,0,0,0.2)'
      wide
      bgColor='light'
      color='white'
      my='20px'
      mx='20px'>
      <Block bgColor='secondary' wide align='flex-end center'>
        <Block h='80%'>
          <Runner
            onRun={onRun}
            relative
            tall
            ml='10px'
            running={running}
            hasRun={hasRun} />
        </Block>
        <Box flex align='flex-end center'>
          <Tab bgColor='secondary' color='white' name='documentation' fs='s'/>
          <Tab bgColor='secondary' color='white' active name='code' fs='s'/>
        </Box>
      </Block>
      <Block h='calc(100% - 40px)' p='10px' wide relative align='start start'>
        <Buttons
          onRun={onRun}
          hasRun={hasRun}
          running={running}
          active={active}
          inputType={inputType}
          cursor={selectedLine || sequence.length - 1} type={animals[active].type}/>
        {inputType === 'icons' ? <Code {...props}/> : <CodeBox {...props} />}
      </Block>
    </Block>
  )
}

export default {
  render
}

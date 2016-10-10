/** @jsx element */

import element from 'vdux/element'
import {Block, Text, MenuItem} from 'vdux-containers'
import Buttons from './Buttons'
import CodeBox from './CodeBox'
import Code from './Code'

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
    <Block minHeight='600px' wide bgColor='#c5c5c5' my='20px' mx='20px'>
      <Block wide align='flex-start center'>
        <MenuItem
          cursor='default'
          hoverProps={{}}
          bgColor='#c5c5c5'
          textAlign='center'
          highlight
          p='10px'
          w='200px'
          h='40px'>
          <Text textAlign='center' fontWeight='800'>input</Text>
        </MenuItem>
      </Block>
      <Block h='calc(100% - 40px)' wide relative align='start start'>
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

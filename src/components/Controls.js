/** @jsx element */

import element from 'vdux/element'
import {Block} from 'vdux-ui'
import Buttons from './Buttons'
import CodeBox from './CodeBox'
import Code from './Code'

function render ({props}) {
  const {active, animals, running, selectedLine, hasRun, inputType} = props
  const sequence = animals[active].sequence || []

  return (
    <Block relative bgColor='#A7B4CB' wide tall>
      <Block tall relative align='start start'>
        <Buttons
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

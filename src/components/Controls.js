/** @jsx element */

import element from 'vdux/element'
import {Block} from 'vdux-ui'
import Buttons from './Buttons'
import CodeBox from './CodeBox'
import Code from './Code'

function render ({props}) {
  let {active, animals, running, selectedLine, hasRun, inputType} = props

  return (
    <Block absolute bgColor='#A7B4CB' wide tall>
      <Block tall relative align='start start'>
        <Buttons
          hasRun={hasRun}
          running={running}
          active={active}
          inputType={inputType}
          cursor={selectedLine || animals[active].sequence.length - 1} type={animals[active].type}/>
        {inputType === 'icons' ? <Code {...props}/> : <CodeBox {...props} />}
      </Block>
    </Block>
  )
}

export default {
  render
}

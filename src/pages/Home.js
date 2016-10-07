/** @jsx element */

import ModalMessage from '../components/ModalMessage'
import Controls from '../components/Controls'
import element from 'vdux/element'
import {Block} from 'vdux-ui'
import Output from '../components/Output'

function render ({props}) {
  const {
    selectedLine,
    activeLine,
    running,
    active,
    hasRun,
    message,
    game,
    left
  } = props

  const {
    animals,
    inputType
  } = game

  const size = '550px'

  return (
    <Block bgColor='#e5e5e5' relative w='calc(100% - 60px)' tall left={left}>
      <Block
        relative
        display='flex'
        left='0'
        minHeight='100%'
        h='100%'
        wide>
        <Output size={size} tabs={['sandbox']} tab='sanbox' {...game} {...props}/>
        <Controls
          selectedLine={selectedLine}
          activeLine={activeLine}
          inputType={inputType}
          running={running}
          hasRun={hasRun}
          active={active}
          animals={animals}/>
      </Block>
      {message && <ModalMessage
        header={message.header}
        body={message.body}lineNumber={activeLine + 1}/>
      }
    </Block>
  )
}

export default {
  render
}

/** @jsx element */

import ModalMessage from '../components/ModalMessage'
import Controls from '../components/Controls'
import element from 'vdux/element'
import {Block} from 'vdux-ui'
import Output from '../components/Output'
import omit from '@f/omit'

function render ({props}) {
  const {
    selectedLine,
    activeLine,
    running,
    active,
    hasRun,
    game,
    left
  } = props

  const {
    animals,
    inputType
  } = game

  const size = '400px'

  const outputProps = {
    inputType,
    animals: animals.map((animal) => omit('sequence', animal)),
    running,
    active,
    size
  }

  return (
    <Block bgColor='background' relative wide tall>
      <Block
        relative
        display='flex'
        left='0'
        minHeight='100%'
        wide>
        <Output
          size={size}
          tabs={['sandbox']}
          tab='sandbox'
          options
          {...game}
          {...outputProps}
        />
        <Controls
          selectedLine={selectedLine}
          activeLine={activeLine}
          inputType={inputType}
          running={running}
          hasRun={hasRun}
          active={active}
          animals={animals}/>
      </Block>
    </Block>
  )
}

export default {
  render
}

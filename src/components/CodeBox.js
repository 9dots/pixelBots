/** @jsx element */

import {aceUpdate} from '../actions'
import element from 'vdux/element'
import {Box} from 'vdux-ui'
import Ace from 'vdux-ace'

require('brace/mode/javascript')
require('brace/theme/tomorrow_night')

function render ({props}) {
  const {active, activeLine, running, animals} = props
  const sequence = animals[active].sequence || []

  return (
    <Box relative flex tall fontFamily='code'>
      <Ace
        name='code-editor'
        mode='javascript'
        height='100%'
        width='100%'
        fontSize='18px'
        highlightActiveLine={false}
        activeLine={running ? activeLine : -1}
        onChange={(code) => aceUpdate({id: active, code})}
        value={sequence.length > 0 ? sequence : ''}
        theme='tomorrow_night' />
    </Box>
  )
}

export default {
  render
}

/** @jsx element */

import animalApis from '../animalApis'
import {aceUpdate} from '../actions'
import element from 'vdux/element'
import {Box} from 'vdux-ui'
import Ace from 'vdux-ace'

require('brace/mode/javascript')
require('brace/theme/tomorrow_night')

let setValue

function * onUpdate (prev, next) {
  const {active, animals, startCode = ''} = next.props
  const sequence = animals[active].sequence.length < 1
    ? ''
    : animals[active].sequence
  const prevSequence = prev.props.animals[active].sequence
  if (prevSequence !== sequence && sequence === startCode && setValue) {
    setValue(startCode)
  }
}

function render ({props}) {
  const {active, activeLine, running, animals, startCode, hasRun, canCode = true, editorActions = {}} = props
  const sequence = animals[active].sequence || []
  const addCodeHandler = editorActions.aceUpdate || aceUpdate

  const jsOptions = {
    undef: true,
    esversion: 6,
    asi: true,
    browserify: true,
    predef: [
      ...Object.keys(animalApis[animals[active].type].docs),
      'require',
      'console'
    ]
  }

  return (
    <Box relative flex tall fontFamily='code' class='code-editor'>
      <Ace
        name='code-editor'
        mode='javascript'
        height='100%'
        width='100%'
        fontSize='18px'
        ref={_setValue => setValue = _setValue}
        readOnly={!canCode}
        jsOptions={jsOptions}
        highlightActiveLine={false}
        activeLine={hasRun ? activeLine : -1}
        onChange={(code) => addCodeHandler({id: active, code})}
        value={sequence.length > 0 ? sequence : startCode || ''}
        theme='tomorrow_night' />
    </Box>
  )
}

export default {
  onUpdate,
  render
}

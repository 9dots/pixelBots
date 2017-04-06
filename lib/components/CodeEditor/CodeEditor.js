/**
 * Imports
 */

import {component, element} from 'vdux'
import {Box} from 'vdux-ui'
import Ace from 'vdux-ace'

require('brace/mode/javascript')
require('brace/theme/tomorrow_night')

let setValue
let scrollToLine

/**
 * <Code Editor/>
 */

export default component({
	* onUpdate (prev, next) {
	  const {active, animals, startCode = ''} = next.props
	  const sequence = (animals[active].sequence || '').length < 1
	    ? ''
	    : animals[active].sequence
	  const prevSequence = prev.props.animals[active].sequence
	  if (prevSequence !== sequence && sequence === startCode && setValue) {
	    yield setValue(startCode)
	  }

	  if (prev.props.activeLine !== next.props.activeLine) {
		  yield scrollToLine(next.props.activeLine - 1)
	  }
	},
  render ({props, actions}) {
	  const {active, activeLine, running, setCode, animals, docs, startCode, hasRun, canCode = true, saveRef} = props
	  const {sequence = ''} = animals[active]

	  const jsOptions = {
	    undef: true,
	    esversion: 6,
	    asi: true,
	    browserify: true,
	    predef: [
	      ...Object.keys(docs),
	      'require',
	      'console'
	    ]
	  }

	  return (
	    <Box display='flex' relative flex tall class='code-editor'>
	      <Ace
	      	ref={enableEditorActions}
	        name='code-editor'
	        mode='javascript'
	        height='100%'
	        key={'editor-' + saveRef}
	        width='100%'
	        fontSize='14px'
	        readOnly={!canCode}
	        jsOptions={jsOptions}
	        fontFamily='code'
	        highlightActiveLine={false}
	        activeLine={hasRun ? activeLine - 1 : -1}
	        onChange={setCode}
	        value={sequence.length > 0 ? sequence : startCode || ''}
	        theme='tomorrow_night' />
	    </Box>
	  )
  }
})

function enableEditorActions (actions) {
	setValue = actions.setValue
	scrollToLine = actions.scrollToLine
}

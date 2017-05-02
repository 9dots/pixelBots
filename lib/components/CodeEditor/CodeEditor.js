/**
 * Imports
 */

import EditorBar from 'components/EditorBar'
import TextApi from 'components/TextApi'
import {component, element} from 'vdux'
import getLoc from 'utils/linesOfCode'
import {Block, Box} from 'vdux-ui'
import Ace from 'vdux-ace'

require('brace/mode/javascript')
require('brace/theme/tomorrow_night')

let setValue
let scrollToLine

/**
 * <Code Editor/>
 */

export default component({
  render ({props, actions}) {
	  const {active, activeLine, running, readOnly, onChange, canAutoComplete, initialData, sequence = '', docs, startCode, hasRun, saved, canCode = true, saveRef} = props

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
      <Block column tall>
        {
          !readOnly && <EditorBar
            bgColor='#1D1F21'
            canAutoComplete={canAutoComplete}
            initialData={initialData}
            saveRef={saveRef}
            saved={saved}
            loc={getLoc(sequence)}
            inputType='code' />
        }
        <Block flex tall wide align='start start'>
    	  	<Block wide tall align='center center'>
            <TextApi {...props} bgColor='#1D1F21' />
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
    		        onChange={onChange}
    		        value={sequence.length > 0 ? sequence : startCode || ''}
    		        theme='tomorrow_night' />
    		    </Box>
    		  </Block>
        </Block>
      </Block>
	  )
  },

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
  }
})

function enableEditorActions (actions) {
	setValue = actions.setValue
	scrollToLine = actions.scrollToLine
}

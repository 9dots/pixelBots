/**
 * Imports
 */

import TextApi from 'components/TextApi'
import {component, element} from 'vdux'
import animalApis from 'animalApis'
import {Box} from 'vdux-ui'
import Ace from 'vdux-ace'

require('brace/mode/javascript')
require('brace/theme/tomorrow_night')

let setValue

/**
 * <Code Editor/>
 */

export default component({
	* onUpdate (prev, next) {
	  const {active, animals, startCode = ''} = next.props
	  const sequence = animals[active].sequence.length < 1
	    ? ''
	    : animals[active].sequence
	  const prevSequence = prev.props.animals[active].sequence
	  if (prevSequence !== sequence && sequence === startCode) {
	    yield setValue(startCode)
	  }
	},
  render ({props, actions}) {
	  const {active, activeLine, running, animals, startCode, hasRun, canCode = true} = props
	  const sequence = animals[active].sequence || []

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
	    <Box display='flex' relative flex tall class='code-editor'>
	    	<TextApi bgColor='offSecondary' w='180px' type={animals[active].type}/>
	      <Ace
	      	ref={actions => setValue = actions.setValue}
	        name='code-editor'
	        mode='javascript'
	        height='100%'
	        width='100%'
	        fontSize='14px'
	        readOnly={!canCode}
	        jsOptions={jsOptions}
	        fontFamily='code' 
	        highlightActiveLine={false}
	        activeLine={hasRun ? activeLine : -1}
	        onChange={actions.onChange}
	        value={sequence.length > 0 ? sequence : startCode || ''}
	        theme='tomorrow_night' />
	    </Box>
	  )
  },
  controller: {
  	* onChange ({props}, code) {
  		yield props.gameActions.codeChange({id: props.active, code})
  	}
  }
})

/**
 * Imports
 */

import CodeEditor from 'components/CodeEditor'
// import Buttons from 'components/Buttons'
import {component, element} from 'vdux'
import getLoc from 'utils/linesOfCode'
import {Block} from 'vdux-containers'
import Runner from './Runner'
// import Code from 'components/Code'

/**
 * <Game Input/>
 */

export default component({
  render ({props}) {
	  const {
	    selectedLine,
	  	targetPainted,
	  	gameActions,
	    inputType,
	    minHeight = '600px',
	    running,
	    animals,
	    canCode,
	    active,
	    saved
	  } = props

	  const sequence = animals[active].sequence || []
	  const loc = getLoc(sequence)

	  return (
	    <Block
	      minHeight={minHeight}
	      column
	      tall
	      relative
	      w={props.w || '100%'}
	      color='white'>
	      <Block flex tall wide align='start start'>
	     		<Block wide tall align='center center'>
		      	{/* <Buttons
  				        startAddLoop={startAddLoop}
  				        selectedLine={selectedLine}
  				        running={running}
  				        canCode={canCode}
  				        active={active}
  				        type={animals[active].type}
  				        editorActions={editorActions}
  				        inputType={inputType} /> */}
			      <CodeEditor {...props} />
	        </Block>
	      </Block>
	      <Runner
	        bgColor={inputType === 'icons' ? '#A7B4CB' : '#1D1F21'}
	        canAutoComplete={!!targetPainted}
	      	gameActions={gameActions}
	        initialData={props.initialData}
	        saveRef={props.saveRef}
	        saved={saved}
	        loc={loc}
	        inputType={inputType} />
	    </Block>
	  )
  }
})


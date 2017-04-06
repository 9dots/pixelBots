/**
 * Imports
 */

import BlockButtons from 'components/BlockButtons'
import BlockEditor from 'components/BlockEditor'
import CodeEditor from 'components/CodeEditor'
import TextApi from 'components/TextApi'
import {component, element} from 'vdux'
import getLoc from 'utils/linesOfCode'
import {Block} from 'vdux-containers'
import animalApis from 'animalApis'
import Runner from './Runner'

/**
 * <GameInput/>
 */

export default component({
  render ({props, actions}) {
	  const {
	  	targetPainted,
	  	gameActions = {},
	  	editorState,
	    inputType,
	    selected,
	    readOnly,
	    minHeight = '600px',
	    clipboard,
	    running,
	    animals,
	    canCode,
	    active,
	    code,
	    saved
	  } = props

	  const animal = animals[active]
	  const docs = animalApis[animal.type].docs || {}
	  const sequence = animal.sequence || []
	  const loc = getLoc(sequence)

	  return (
	    <Block
	      minHeight={minHeight}
	      column
	      tall
	      relative
	      w={props.w || '100%'}
	      color='white'>
	      {
	      	!readOnly && <Runner
  	        bgColor={inputType === 'icons' ? '#A7B4CB' : '#1D1F21'}
  	        canAutoComplete={!!targetPainted}
  	      	gameActions={gameActions}
  	      	sequence={sequence}
  	      	selected={selected}
  	      	canUndo={props.editorState.length > 0}
  	      	clipboard={clipboard}
  	      	removeSelected={gameActions.removeSelected}
  	      	invertSelection={gameActions.invertSelection}
  	        initialData={props.initialData}
  	        saveRef={props.saveRef}
  	        saved={saved}
  	        loc={loc}
  	        inputType={inputType} />
  	    }
	      <Block flex tall wide align='start start'>
	     		<Block wide tall align='center center'>
	     			<GameSidebar
	     				w='180px'
	     				bgColor='offSecondary'
	     				docs={docs}
	     				inputType={inputType}
	     				readOnly={readOnly}
	     				canCode={canCode}
	     				addBlock={!readOnly && gameActions.addBlock(active)} />
	     			<GameEditor
	     				{...props}
	     				bgColor='#A7B4CB'
	     				docs={docs}
	     				readOnly={readOnly}
	     				sequence={sequence}
	     				setCode={!readOnly && gameActions.setCode(active)}
	     				setCursor={gameActions.setCursor}
	     				selectBlock={!readOnly && gameActions.selectBlock}
	     				setArgument={!readOnly && gameActions.setArgument}
	     				setBlockPayload={!readOnly && gameActions.setBlockPayload(active)} />
	        </Block>
	      </Block>
	    </Block>
	  )
  }
})

/**
 * <GameSidebar/>
 */

const GameSidebar = component({
	render ({props}) {
		const {inputType} = props

		switch (inputType) {
			case 'code':
				return <TextApi {...props} />
			case 'icons':
				return <BlockButtons {...props} />
			default:
				throw new Error('<CodeSidebar/>: invalid inputType')
		}
	}
})

/**
 * <GameEditor/>
 */

const GameEditor = component({
	render ({props}) {
		const {inputType} = props

		return inputType === 'code'
			? <CodeEditor {...props} />
			: <BlockEditor {...props} />
	}
})


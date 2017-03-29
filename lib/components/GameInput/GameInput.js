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
	  	gameActions,
	    inputType,
	    minHeight = '600px',
	    running,
	    animals,
	    canCode,
	    code,
	    active,
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
	      <Block flex tall wide align='start start'>
	     		<Block wide tall align='center center'>
	     			<GameSidebar
	     				w='180px'
	     				bgColor='offSecondary'
	     				docs={docs}
	     				inputType={inputType}
	     				canCode={canCode}
	     				addBlock={gameActions.addBlock(active)} />
	     			<GameEditor
	     				{...props}
	     				docs={docs}
	     				sequence={sequence}
	     				setCode={gameActions.setCode(active)}
	     				setCursor={gameActions.setCursor}
	     				selectBlock={gameActions.selectBlock}
	     				removeBlock={gameActions.removeBlock(active)}
	     				setArgument={gameActions.setArgument(active)}
	     				setBlockPayload={gameActions.setBlockPayload(active)} />
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

/**
 * <GameSidebar/>
 */

const GameSidebar = component({
	render ({props}) {
		const {inputType, docs, addBlock, canCode, ...rest} = props

		switch (inputType) {
			case 'code':
				return <TextApi docs={docs} {...rest} />
			case 'icons':
				return <BlockButtons canCode={canCode} addBlock={addBlock} docs={docs} {...rest} />
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


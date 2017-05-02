/**
 * Imports
 */

import BlockEditor from 'components/BlockEditor'
import CodeEditor from 'components/CodeEditor'
import {component, element} from 'vdux'
import animalApis from 'animalApis'
import {Block} from 'vdux-ui'

/**
 * <GameEditor/>
 */

export default component({
	render ({props}) {
		const {inputType, animals, targetPainted, active, w, minHeight = '600px'} = props
		const animal = animals[active]
		const docs = animalApis[animal.type].docs || {}

		return (
			<Block
				minHeight={minHeight}
	      minWidth='480px'
	      column
	      tall
	      relative
	      flex
	      w={w || '100%'}
	      color='white'>
	      {
	      	inputType === 'code'
						? <CodeEditor {...props} docs={docs} canAutoComplete={!!targetPainted} />
						: <BlockEditor {...props} docs={docs} canAutoComplete={!!targetPainted} />
				}
			</Block>
		)
	}
})


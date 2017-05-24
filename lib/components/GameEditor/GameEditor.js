/**
 * Imports
 */

import BlockEditor from 'components/BlockEditor'
import CodeEditor from 'components/CodeEditor'
import {component, element} from 'vdux'
import filterObj from '@f/filter-obj'
import {Block} from 'vdux-ui'

/**
 * <GameEditor/>
 */

export default component({
	render ({props}) {
		const {inputType, animals, targetPainted, traits, active, w, minHeight = '600px'} = props
		const animal = animals[active]

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
						? <CodeEditor {...props} canAutoComplete={!!targetPainted} />
						: <BlockEditor {...props} canAutoComplete={!!targetPainted} />
				}
			</Block>
		)
	}
})

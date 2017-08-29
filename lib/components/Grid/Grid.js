/**
 * Imports
 */

import {component, element} from 'vdux'
import {Block, Flex} from 'vdux-ui'
import range from '@f/range'

/**
 * <Grid/>
 */

export default component({
  render ({props, state, actions, children}) {
	  const {dragging, mouseDown, paintedRows} = state
	  const {
	    numRows = 5,
	    levelSize,
	    paintMode,
	    w = '100%',
	    h = '100%',
			numColumns
	  } = props

	  const size = parseFloat(levelSize) / numRows + 'px'

	  return (
	      <Block
	        w={levelSize}
	        h={levelSize}
	        relative>
	        <Block>
	        	{
	        		range(numColumns).map((v, i) => {
	        			return <Block>
		        			{
		        				range(numRows).map(() => (
		        					<Block sq={size} border='1px solid #333'/>
		        				))
		        			}
		        		</Block>
	        		})
	        	}
	        </Block>
	        {children}
	      </Block>
	  )
  }
})

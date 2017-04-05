/**
 * Imports
 */

import {component, element} from 'vdux'
import Cell from 'components/Cell'
import {Flex} from 'vdux-ui'

/**
 * <Row/>
 */

export default component({
  render ({props}) {
  	const {numColumns, numRows, painted, row, key, ...restProps} = props

	  return (
	    <Flex key={`rowholder-${row}`} alignItems='center center'>
	      {Array.from({length: numColumns}, (v,k) => k + 1).map((i) => (
	      	<Cell
		      	key={`cell-${row}-${i}`}
	      		y={i - 1}
	      		x={row - 1}
	      		lastColumn={parseInt(numColumns, 10) === i}
	      		lastRow={parseInt(numRows, 10) === row}
	      		color={getColor(painted, i)} 
	      		{...restProps} />
	      ))}
	    </Flex>
	  )
  }
})

function getColor (painted = {}, idx) {
  return painted[idx] ? painted[idx] : 'white'
}

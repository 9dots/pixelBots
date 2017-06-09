/**
 * Imports
 */


import {component, element} from 'vdux'
import {Block} from 'vdux-ui'

/**
 * <TetrisL />
 */

export default component({
	render ({props}) {
		return (
			<Block transform='rotate(90deg)' align='center center' {...props}>
				<svg height='40' fill='white' viewBox="0 -12 100 125">
          <rect x="24.4" y="13.2" width="18.7" height="18.7"/>
          <rect x="24.4" y="35.6" width="18.7" height="18.7"/>
          <rect x="46.8" y="58" width="18.7" height="18.7"/>
          <rect x="24.4" y="58" width="18.7" height="18.7"/>
				</svg>
			</Block>
		)
	}
})

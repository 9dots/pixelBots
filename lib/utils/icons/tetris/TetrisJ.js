/**
 * Imports
 */


import {component, element} from 'vdux'
import {Block} from 'vdux-ui'

/**
 * <TetrisJ />
 */

export default component({
	render ({props}) {
		const {color = 'white', ...rest} = props
		
		return (
			<Block align='center center' {...rest}>
				<svg height='40' fill={color} viewBox="0 -12 100 125">
          <rect x="46.8" y="13.2" width="18.7" height="18.7"/>
          <rect x="46.8" y="35.6" width="18.7" height="18.7"/>
          <rect x="24.4" y="58" width="18.7" height="18.7"/>
          <rect x="46.8" y="58" width="18.7" height="18.7"/>
				</svg>
			</Block>
		)
	}
})

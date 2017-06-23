/**
 * Imports
 */


import {component, element} from 'vdux'
import {Block} from 'vdux-ui'

/**
 * <TetrisZ />
 */

export default component({
	render ({props}) {
		const {color = 'white', ...rest} = props
	
		return (
			<Block align='center center' {...rest}>
				<svg height='40' fill={color} viewBox="0 -12 100 125" transform='rotate(90)'>
	        <rect x="13.2" y="24.4" width="18.7" height="18.7"/>
	        <rect x="35.6" y="24.4" width="18.7" height="18.7"/>
	        <rect x="35.6" y="46.8" width="18.7" height="18.7"/>
	        <rect x="58" y="46.8" width="18.7" height="18.7"/>
				</svg>
			</Block>
		)
	}
})

/**
 * Imports
 */


import {component, element} from 'vdux'
import {Block} from 'vdux-ui'

/**
 * <LoopIcon />
 */

export default component({
	render ({props}) {
		return (
			<Block align='center center' {...props}>
				<svg height='40' fill='white' viewBox="0 -12 100 125">
					<path d="M77.5,75.9c-0.3,0.3-0.5,0.5-0.8,0.8c-3.7,3.7-8.1,6.6-12.9,8.5h32.6v-9.3H77.5z"/>
					<path d="M50.1,15c-19.4,0-35.1,15.7-35.1,35.1c0,9.1,3.4,17.3,9.1,23.6h15.5c-9-4-15.3-13.1-15.3-23.6c0-14.2,11.6-25.8,25.8-25.8  c14.2,0,25.8,11.6,25.8,25.8c0,14.2-11.6,25.8-25.8,25.8H26.4H3.8v9.3h46.3c19.4,0,35.1-15.7,35.1-35.1C85.2,30.7,69.5,15,50.1,15z"/>
				</svg>
			</Block>
		)
	}
})
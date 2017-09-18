/**
 * Imports
 */


import {component, element} from 'vdux'
import {Block} from 'vdux-ui'

/**
 * <LeftWrapIcon />
 */

export default component({
	render ({props}) {
		return (
			<Block align='center center' {...props}>
				<svg height='40' fill='white' viewBox="0 0 210 210">
					<g>
						<rect x="142" y="104.7" width="19.3" height="8.8"/>
						<rect x="110.9" y="104.7" width="19.3" height="8.8"/>
						<rect x="79.8" y="104.7" width="19.3" height="8.8"/>
						<rect x="48.6" y="104.7" width="19.3" height="8.8"/>
						<polygon points="76.4,67.3 192.5,67.3 192.5,76.1 76.4,76.1 79.1,92.2 43.3,71.6 79.1,50.9 	"/>
						<polygon points="138.9,142.1 183.7,142.1 183.7,113.5 173.2,113.5 173.2,104.7 192.5,104.7 192.5,113.5 192.5,142.1 192.5,150.9 
							138.9,150.9 141.5,167.1 105.7,146.4 141.5,125.8 	"/>
						<polygon points="36.8,67.3 36.8,76.1 26.3,76.1 26.3,104.7 36.8,104.7 36.8,113.5 26.3,113.5 17.5,113.5 17.5,104.7 17.5,76.1 
							17.5,67.3 	"/>
					</g>
				</svg>
			</Block>
		)
	}
})
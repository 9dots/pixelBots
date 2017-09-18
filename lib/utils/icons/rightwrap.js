/**
 * Imports
 */


import {component, element} from 'vdux'
import {Block} from 'vdux-ui'

/**
 * <RightWrapIcon />
 */

export default component({
	render ({props}) {
		return (
			<Block align='center center' {...props}>
				<svg height='40' fill='white' viewBox="0 0 210 210">
					<g>
						<rect x="48.6" y="104.7" width="19.3" height="8.8"/>
						<rect x="79.8" y="104.7" width="19.3" height="8.8"/>
						<rect x="110.9" y="104.7" width="19.3" height="8.8"/>
						<rect x="142" y="104.7" width="19.3" height="8.8"/>
						<polygon points="133.6,67.3 17.5,67.3 17.5,76.1 133.6,76.1 130.9,92.2 166.7,71.6 130.9,50.9 	"/>
						<polygon points="71.1,142.1 26.3,142.1 26.3,113.5 36.8,113.5 36.8,104.7 17.5,104.7 17.5,113.5 17.5,142.1 17.5,150.9 71.1,150.9 
							68.5,167.1 104.3,146.4 68.5,125.8 	"/>
						<polygon points="173.2,67.3 173.2,76.1 183.7,76.1 183.7,104.7 173.2,104.7 173.2,113.5 183.7,113.5 192.5,113.5 192.5,104.7 
							192.5,76.1 192.5,67.3 	"/>
					</g>
				</svg>
			</Block>
		)
	}
})
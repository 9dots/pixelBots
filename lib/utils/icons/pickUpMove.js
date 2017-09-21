/**
 * Imports
 */


import {component, element} from 'vdux'
import {Block} from 'vdux-ui'

/**
 * <PickUpMove Icon />
 */

export default component({
	render ({props}) {
		const {h = 40, color = 'white'} = props
		
		return (
			<Block align='center stretch' {...props}>
				<svg height={h} fill={color} x='0px' y='0px' viewBox='-10 -10 200 200' enable-background='new 0 0 170 170'>
					<path d="M163,82.3l-27.3-22.7c-1.7-1.4-4.2-1.2-5.6,0.5c-1.4,1.7-1.2,4.2,0.5,5.6l19.1,15.9l-74.2-0.9c-2.2,0-4,1.7-4,4
	c0,2.2,1.7,4,4,4l73.1,0.9l-18.4,14.6c-1.7,1.4-2,3.9-0.7,5.6c0.8,1,2,1.5,3.1,1.5c0.9,0,1.7-0.3,2.5-0.9l27.8-22
	c0.9-0.7,1.5-1.9,1.5-3.1C164.5,84.2,164,83,163,82.3z"/>
				<g>
					<polygon points="9.5,45.8 18.5,45.8 18.5,40.8 23.5,40.8 23.5,31.8 9.5,31.8 	"/>
					<rect x="69.3" y="31.8" width="19.5" height="9"/>
					<rect x="36.6" y="31.8" width="19.5" height="9"/>
					<polygon points="102,31.8 102,40.8 107,40.8 107,45.8 116,45.8 116,31.8 	"/>
					<rect x="107" y="58.9" width="9" height="19.5"/>
					<rect x="107" y="91.6" width="9" height="19.5"/>
					<polygon points="107,129.2 102,129.2 102,138.2 116,138.2 116,124.2 107,124.2 	"/>
					<rect x="69.3" y="129.2" width="19.5" height="9"/>
					<rect x="36.6" y="129.2" width="19.5" height="9"/>
					<polygon points="18.5,124.2 9.5,124.2 9.5,138.2 23.5,138.2 23.5,129.2 18.5,129.2 	"/>
					<rect x="9.5" y="58.9" width="9" height="19.5"/>
					<rect x="9.5" y="91.6" width="9" height="19.5"/>
				</g>
				</svg>
			</Block>
		)
	}
})
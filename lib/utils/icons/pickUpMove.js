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
				<svg height={h} fill={color} x='0px' y='0px' viewBox='0 0 230 230' enable-background='new 0 0 210 210'>
					<path d="M203,102.3l-27.3-22.7c-1.7-1.4-4.2-1.2-5.6,0.5c-1.4,1.7-1.2,4.2,0.5,5.6l19.1,15.9l-74.2-0.9c-2.2,0-4,1.7-4,4
	c0,2.2,1.7,4,4,4l73.1,0.9l-18.4,14.6c-1.7,1.4-2,3.9-0.7,5.6c0.8,1,2,1.5,3.1,1.5c0.9,0,1.7-0.3,2.5-0.9l27.8-22
	c0.9-0.7,1.5-1.9,1.5-3.1C204.5,104.2,204,103,203,102.3z"/>
<g>
	<polygon points="51.8,65.8 60.8,65.8 60.8,60.8 65.8,60.8 65.8,51.8 51.8,51.8 	"/>
	<rect x="111.6" y="51.8" width="19.5" height="9"/>
	<rect x="78.9" y="51.8" width="19.5" height="9"/>
	<polygon points="144.2,51.8 144.2,60.8 149.2,60.8 149.2,65.8 158.2,65.8 158.2,51.8 	"/>
	<rect x="149.2" y="78.9" width="9" height="19.5"/>
	<rect x="149.2" y="111.6" width="9" height="19.5"/>
	<polygon points="149.2,149.2 144.2,149.2 144.2,158.2 158.2,158.2 158.2,144.2 149.2,144.2 	"/>
	<rect x="111.6" y="149.2" width="19.5" height="9"/>
	<rect x="78.9" y="149.2" width="19.5" height="9"/>
	<polygon points="60.8,144.2 51.8,144.2 51.8,158.2 65.8,158.2 65.8,149.2 60.8,149.2 	"/>
	<rect x="51.8" y="78.9" width="9" height="19.5"/>
	<rect x="51.8" y="111.6" width="9" height="19.5"/>
</g>
</svg>
			</Block>
		)
	}
})
/**
 * Imports
 */


import {component, element} from 'vdux'
import {Block} from 'vdux-ui'

/**
 * <EraseIcon />
 */

export default component({
	render ({props}) {
		return (
			<Block align='center center' {...props}>
				<svg height='100%' x="0px" y="0px" viewBox="0 0 24 24" enable-background="new 0 0 24 24">
					<path d="M13.2,3.5L8,8.7l7.2,7.2l5.2-5.2c0.7-0.7,0.7-1.9,0-2.6l-4.6-4.6C15.1,2.8,13.9,2.8,13.2,3.5z"></path><path fill="none" stroke="#000000" stroke-width="2" stroke-linejoin="round" stroke-miterlimit="10" d="M11.3,20l9.2-9.2  c0.7-0.7,0.7-1.9,0-2.6l-4.6-4.6c-0.7-0.7-1.9-0.7-2.6,0l-9.7,9.7c-0.7,0.7-0.7,1.9,0,2.6L7.7,20l0,0H22"></path>
				</svg>
			</Block>
		)
	}
})
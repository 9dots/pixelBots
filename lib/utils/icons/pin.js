/**
 * Imports
 */


import {component, element} from 'vdux'
import {Block} from 'vdux-ui'

/**
 * <Steps Icon />
 */

export default component({
	render ({props}) {
		const {h = 40, color = 'white'} = props
		
		return (
			<Block align='center stretch' {...props}>
				<svg height={h} fill={color} x='0px' y='0px' viewBox='5 8 90 90' enable-background='new 0 0 100 100'>
					<g>
						<path d="M29.1,53.5H29c-1.7,0-3,1.3-3,3s1.3,3,3,3h2h16v17c0,1.7,1.3,3,3,3s3-1.3,3-3v-17h16h2c1.7,0,3-1.3,3-3s-1.3-3-3-3h-0.1   L66,43.8V26.5h3c1.7,0,3-1.3,3-3s-1.3-3-3-3H31c-1.7,0-3,1.3-3,3s1.3,3,3,3h3v17.3L29.1,53.5z M60,26.5v18c0,0.5,0.1,0.9,0.3,1.3   l3.8,7.7H35.9l3.8-7.7c0.2-0.4,0.3-0.9,0.3-1.3v-18H60z"/>
						<path d="M54,43.5c1.7,0,3-1.3,3-3v-9c0-1.7-1.3-3-3-3s-3,1.3-3,3v9C51,42.2,52.3,43.5,54,43.5z"/>
					</g>

				</svg>
			</Block>
		)
	}
})
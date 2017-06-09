/**
 * Imports
 */

import {Block, Icon} from 'vdux-ui'
import {component, element} from 'vdux'

/**
 * <Badge/>
 */

export default component({
	render ({props, children}) {
		const {color = 'blue', size = 140, name, icon} = props

		return (
			<Block textAlign='center'>
				<Block
					boxShadow={`inset 0 0 0 3px rgba(white,.8), inset 0 0 0 999px rgba(0,0,0,.25), 0 1px 4px rgba(0,0,0,.5)`}
					align='center center'
					bgColor={color} 
					border={`13px solid ${color}`}
					circle={size} 
					mx='auto' >
					<Icon name={icon} fs={size * .5} color={color} />
				</Block>
				<Block fontFamily='"Press Start 2P"' fs={13} mt='l'>
					{name}
				</Block>
			</Block>
		)
	}
})

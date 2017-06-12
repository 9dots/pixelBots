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
		const {color = 'blue', size = 140, name, icon, count = 1} = props
		const badgeColor = count ? color : '#BBB'
		const message = props.message || 'Play again to earn this badge!'

		return (
			<Block textAlign='center'>
				<Block
					boxShadow={
						count 
							? 'inset 0 0 0 3px rgba(white,.8), inset 0 0 0 999px rgba(0,0,0,.25), 0 1px 4px rgba(0,0,0,.5)'
							: ''
						}
					align='center center'
					bgColor={badgeColor} 
					border={`13px solid ${badgeColor}`}
					circle={size} 
					mx='auto' >
					{
						count
							? <Icon name={icon} fs={size * .5} color={badgeColor} />
							: <Block mx={parseInt(size, 10) * -.33} fontFamily='"Press Start 2P"' fs='xxs' lh='20px'>
									{message}
								</Block>
					}
					
				</Block>
				<Block fontFamily='"Press Start 2P"' fs='xxs' mt='l' align='center center'>
					<Block>{name}</Block>
					{ 
						count > 1 
							? <Block ml='s'>x{count}</Block>
							: ''
						}
				</Block>
			</Block>
		)
	}
})

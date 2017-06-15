/**
 * Imports
 */

import {Block, Icon} from 'vdux-containers'
import {component, element} from 'vdux'

/**
 * <Badge/>
 */

const badgeProps = {
	transition: 'all .2s',
	cursor: 'default',
	userSelect: 'none',
	hoverProps: {
		transform: 'scale(1.03)'
	},
	activeProps: {
		transition: 'all .4s',
		transform: 'rotate(180deg)'
	}
}

export default component({
	render ({props, children}) {
		const {color = 'blue', size = 140, name, icon, count = 1} = props
		const badgeColor = count ? color : '#BBB'
		const message = props.message || 'Play again to earn this badge!'
		const effects = count ? badgeProps : {}

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
					mx='auto'
					{ ...effects }>
					{
						count
							? <Icon userSelect='none' name={icon} fs={size * .5} color={badgeColor} />
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

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

const badgeTypes = {
	completed: {
		color: 'yellow',
		title: 'Completed',
		icon: 'star'
	},
	lineLimit: {
		color: 'blue',
		title: 'Line Limit',
		icon: 'view_list'
	},
	stepLimit: {
		color: 'green',
		title: 'Step Limit',
		icon: 'show_chart'
	},
	errorLimit: {
		color: 'red',
		title: 'Error Limit',
		icon: 'bug_report'
	}
}

export default component({
	render ({props, children}) {
		const {size = 120, count = 1, disabledColor = '#BBB', type, hideTitle = false} = props
		const message = props.message || 'Play again to earn this badge!'
		const effects = count ? badgeProps : {}

		const color = count 
			? props.color || badgeTypes[type].color
			: disabledColor
		const title = props.title || badgeTypes[type].title
		const icon = props.icon || badgeTypes[type].icon

		return (
			<Block textAlign='center'>
				<Block
					boxShadow={
						count
							? 'inset 0 0 0 3px rgba(white,.8), inset 0 0 0 999px rgba(0,0,0,.25), 0 1px 4px rgba(0,0,0,.5)'
							: ''
						}
					align='center center'
					bgColor={color}
					border={`${parseInt(size, 10) * .096}px solid ${color}`}
					circle={size}
					mx='auto'
					opacity={count ? 1 : .6}
					{ ...effects }>
					<Block mx={parseInt(size, 10) * -.25}>
						{
							<Icon userSelect='none' name={icon} fs={size * .5} color={count ? color : '#AAA'} />
						}
					</Block>
				</Block>
				<Block fontFamily='"Press Start 2P"' fs='xxs' mt={24} align='center center' hide={hideTitle} color={count ? 'primary' : '#AAA'}>
					<Block>{title}</Block>
					{
						count > 0
							? <Block ml='s'>x{count}</Block>
							: ''
						}
				</Block>
			</Block>
		)
	}
})

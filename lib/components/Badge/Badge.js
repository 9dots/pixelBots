/**
 * Imports
 */

import {Block, Icon, Tooltip} from 'vdux-containers'
import {component, element} from 'vdux'

/**
 * <Badge/>
 */

const badgeStyle = {
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
	modLimit: {
		color: '#6d79de',
		title: 'Bug Squasher',
		icon: 'bug_report',
		description: 'Completed the challenge within the modification limit.'
	},
	completed: {
		color: 'yellow',
		title: 'Challenge Bot',
		icon: 'star',
		description: 'Completed the challenge.'
	},
	lineLimit: {
		color: 'blue',
		title: 'Shrink Ray',
		icon: 'view_list',
		description: 'Completed the challenge within the line limit.'
	},
	stepLimit: {
		color: 'green',
		title: 'Quick Stepper',
		icon: 'directions_run',
		description: 'Completed the challenge within the step limit.'
	},
	errorLimit: {
		color: 'red',
		title: 'Decoder',
		icon: 'new_releases',
		description: 'Completed the challenge with less than 3 errors.'
	}
}

export default component({
	render ({props, children}) {
		const {size = 120, count = 1, disabledColor = '#BBB', type, hideTitle,
		effects = true, ...rest} = props

		if(!badgeTypes[type]) return <span />

		const message = props.message || 'Play again to earn this badge!'
		const style = count && effects ? badgeStyle : {}
		const description = props.description || badgeTypes[type].description
		const tooltipProps = {
			whiteSpace: 'normal', fs: 'xs',
			...(props.tooltipProps || {})
		}

		const color = count
			? props.color || badgeTypes[type].color
			: disabledColor
		const title = props.title || badgeTypes[type].title
		const icon = props.icon || badgeTypes[type].icon

		return (
			<Block textAlign='center' {...rest}>
				<Tooltip message={description} tooltipProps={tooltipProps}>
					<Block
						boxShadow={
							count
								? 'inset 0 0 0 3px rgba(white,.8), inset 0 0 0 999px rgba(0,0,0,.25)' + (effects ? ',  0 1px 4px rgba(0,0,0,.5)' : '')
								: ''
							}
						align='center center'
						bgColor={color}
						border={`${parseInt(size, 10) * .096}px solid ${color}`}
						circle={size}
						mx='auto'
						opacity={count ? 1 : .6}
						{ ...style}>
						<Block mx={parseInt(size, 10) * -.25} align='center center'>
							<Icon cursor='default' userSelect='none' name={icon} fs={size * .5} color={count ? color : '#A0A0A0'} />
						</Block>
					</Block>
				</Tooltip>
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

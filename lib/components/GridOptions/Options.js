/**
 * Imports
 */

import {Button, Dropdown, MenuItem, Tooltip} from 'vdux-containers'
import {component, element} from 'vdux'
import {Block, Icon} from 'vdux-ui'

/**
 * Options
 */

export default component({
	render({props}) {
		const {toggleAdvanced, toggleStart, toggleCode, toggleTarget, targetGrid, startGrid, startCode, advanced} = props

		const btnProps = advanced 
			? {
					borderColor: 'blue',
					// bgColor: 'red',
					color: 'blue'
				}
			: {}
		const btn = (
			<Button py='s' px fs='s'bgColor='green' disabled={advanced} opacity={advanced ? .2 : 1}>
				More Options
				<Icon  ml='s' mr={-5} fs='s' name='arrow_drop_down'/>
			</Button>
		)
		
		return (
			<Block align='start center'>
        <Button 
        	onClick={toggleAdvanced}
        	hoverProps={{highlight: .02}}
        	focusProps={{highlight: .02}}
        	bgColor='white' 
        	color='primary' 
        	mr='s' 
        	fs='s' 
        	py='s' 
        	px
        	{...btnProps}>
          Advanced Editor
        </Button>
				<Dropdown z={99999} wide left btn={btn}>
					<Item onClick={toggleStart} 
						hidden={!startGrid} 
						text='Start Grid'
						message='Paint the initial grid that will appear when a student first starts a challenge.' />
					<Item onClick={toggleTarget} 
						hidden={!targetGrid} 
						text='Target Grid'
						message='Paint a grid that students will have to recreate using code.' />
					<Item onClick={toggleCode} 
						hidden={!startCode} 
						text='Start Code'
						message='Add starting code that will appear when a student first starts a challenge.' />
        </Dropdown>
			</Block>
		)
	}
})

const Item = component({
	render({props}) {
		const {hidden, text, message, ...rest} = props
		return (
			<MenuItem px={0} align='start center' {...rest}>
        <Icon hidden={hidden} mx='xs' name='check' fs='s'/>
        <Block flex>{text}</Block>
        <Tooltip message={message} h={14} placement='right' tooltipProps={{whiteSpace: 'normal', w: 200, fs: 'xs'}}>
        	<Icon name='info_outline' fs='xs' color='primary' mr={8} />
        </Tooltip>
      </MenuItem>
		)
	}
})
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
	render({props, actions}) {
		const {toggleAdvanced, toggleStart, toggleCode, toggleTarget, targetGrid, startGrid, startCode, advanced} = props

		const btnProps = {mr: 's', fs: 's', py: 's', px: true}
		const advProps = advanced  ? { borderColor: 'blue', color: 'blue'} : {}
		const btn = (
			<Button {...btnProps} bgColor='green'>
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
        	{...btnProps}
        	{...advProps}>
          Advanced Editor
          <Tooltip h={20} message='Use the advanced editor to programatically generate start grids.' placement='bottom' tooltipProps={{whiteSpace: 'normal', w: 200, fs: 'xs', textAlign: 'left'}}>
          	<Icon name='info_outline' fs='s' ml='s' mr={-2} />
        	</Tooltip>
        </Button>
				{
					advanced 
						? <Block align='start center'>
								<Button {...btnProps} bgColor='white' color='primary' hoverProps={{highlight: .02}} focusProps={{highlight: .04}} 
									onClick={actions.openDocs}>
									Docs
								</Button>
								<Button {...btnProps} bgColor='white' color='primary' hoverProps={{highlight: .02}} focusProps={{highlight: .04}}>
									Save
								</Button>
							</Block>
						: <Dropdown z={99999} wide left btn={btn}>
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
	      }
			</Block>
		)
	},
	controller: {
		openDocs: function() {
			window.open(`${window.location.origin}/docs`, '_blank')
	 		return false
		}
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
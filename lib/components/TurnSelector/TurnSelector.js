/**
 * Imports
 */

import {Button, Dropdown, MenuItem} from 'vdux-containers'
import animalApis, {gameImages} from 'animalApis'
import {component, element} from 'vdux'
import {Icon, Block} from 'vdux-ui'

/**
 * <Turn Selector/>
 */
const size = 60
const pad = 4

export default component({
  render ({props, actions}) {
  	const {turn} = actions
  	const {animal, clickHandler, fs = 24, ...rest} = props
  	const image = gameImages[animal]
  	const rose = [null, 0, null, 3, null, 1, null, 2]

  	const btn = (
  		<Button bgColor='#FAFAFA' border='1px solid #CACACA' h={40} color='#111' {...rest}>
    		<Icon fs={fs} name='rotate_90_degrees_ccw' />
  		</Button>
		)

    return (
    	<Dropdown p='s' btn={btn} left m='-60px 0 0 16px' z={9999}>
    		<Block align='start center' flexWrap='wrap' minWidth={(size + (pad * 2)) * 3}>
    			<Block absolute top bottom left right m='auto' border='4px solid divider' circle={`calc(100% - ${size + (pad * 2) + 2}px)`} />
    			{
    				rose.map((dir) =>
    					<Item rot={dir} image={image} onClick={clickHandler} />)
    			}
    		</Block>
    	</Dropdown>
    )
  }
})

const Item = component({
	render ({props}) {
		const {rot, onClick = () => {}, image, ...rest} = props
		if(rot !== null)
			return (
				<MenuItem p={pad} borderRadius='100%' onClick={onClick(rot * 90)} bgColor='transparent' hoverProps={{bgColor: 'grey'}} position='relative'>
					<Block
						transform={`rotate(${rot * 90}deg)`}
						background={`url(${image})`}
		      	backgroundRepeat='no-repeat'
						backgroundSize='cover'
						circle={size} />
				</MenuItem>
			)
		else
			return (<Block sq={size + (pad * 2)} />)
	}
})

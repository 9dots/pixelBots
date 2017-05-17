/**
 * Imports
 */

import {Button, Dropdown, MenuItem} from 'vdux-containers'
import {component, element} from 'vdux'
import animalApis from 'animalApis'
import {Icon, Block} from 'vdux-ui'

/**
 * <Turn Selector/>
 */

export default component({
  render ({props, actions}) {
  	const {turn} = actions
  	const {animals, clickHandler, fs = 24, ...rest} = props 
  	const image = animalApis[animals[0].type].gameImage
  	const rose = [null, 0, null, 3, null, 1, null, 2]

  	const btn = (
  		<Button bgColor='#FAFAFA' border='1px solid #CACACA' h={40} color='#111' {...rest}>
    		<Icon fs={fs} name='rotate_90_degrees_ccw' />
  		</Button>
		)

    return (
    	<Dropdown p='s' btn={btn} left>
    		<Block align='start center' flexWrap='wrap' minWidth={70 * 3}>
    			<Block absolute top bottom left right m='auto' border='1px solid divider' circle='calc(100% - 70px)' />
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
		const {rot, onClick, image, ...rest} = props
		const size = 70
		if(rot !== null)
			return (
				<MenuItem p={0} onClick={onClick(rot * 90)}>
					<Block 
						transform={`rotate(${rot * 90}deg)`}
						background={`url(${image})`} 
		      	backgroundRepeat='no-repeat'
						backgroundSize='cover'
						circle={size} />
				</MenuItem>
			)
		else
			return (<Block sq={size} />)
	}
})

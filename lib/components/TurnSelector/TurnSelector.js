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
  	const {animals, ...rest} = props 
  	const image = animalApis[animals[0].type].imageURL
  	const dirs = [270, 0, 90, 180]

  	const btn = (
  		<Button {...rest} bgColor='#FAFAFA' border='1px solid #CACACA' h={40} color='#111'>
    		<Icon name='rotate_90_degrees_ccw' />
  		</Button>
		)

    return (
    	<Dropdown btn={btn} left>
    		<Block align='start center'>
    			{
    				dirs.map((dir) => 
    					<Item rot={dir} image={image} onClick={turn} />)
    			}
    		</Block>
    	</Dropdown>
    )
  },
  controller: {
  	* turn ({props}, dir) {
  		const {clickHandler, animals = []} = props
  		const rot = animals[0].current.rot
  		yield clickHandler(dir - rot)

    }
  }
})

const Item = component({
	render ({props}) {
		const {rot, onClick, image} = props
		return (
			<MenuItem p='s' onClick={onClick(rot)}>
				<Block 
					border='1px solid rgba(0,0,0, .15)'
	      	boxShadow='0 0 3px rgba(0,0,0, .3)'
					transform={`rotate(${rot}deg)`}
					background={`url(${image})`} 
	      	backgroundRepeat='no-repeat'
					backgroundSize='cover'
					sq={40} />
			</MenuItem>
		)
	}
})

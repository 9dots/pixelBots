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
  	const {animals, clickHandler, ...rest} = props 
  	const image = animalApis[animals[0].type].imageURL
  	const rose = [null, 0, null, 3, null, 1, null, 2]

  	const btn = (
  		<Button {...rest} bgColor='#FAFAFA' border='1px solid #CACACA' h={40} color='#111'>
    		<Icon name='rotate_90_degrees_ccw' />
  		</Button>
		)

    return (
    	<Dropdown p='s' btn={btn} left>
    		<Block align='start center' flexWrap='wrap' w={180}>
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

		if(rot !== null)
			return (
				<MenuItem p={0} onClick={onClick(rot * 90)}>
					<Block 
						p='s'
						border='1px solid divider'
						boxShadow='1px 0 1px rgba(0,0,0, .2)'
						transform={`rotate(${rot * 90}deg)`}
						background={`url(${image})`} 
		      	backgroundRepeat='no-repeat'
						backgroundSize='cover'
						circle={60} />
				</MenuItem>
			)
		else
			return (<Block sq={60} />)
	}
})

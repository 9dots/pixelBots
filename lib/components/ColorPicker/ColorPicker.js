/**
 * Imports
 */

import {Dropdown, Grid, Button} from 'vdux-containers'
import {Block, Icon} from 'vdux-ui'
import ColorSwatch from './ColorSwatch'
import {component, element} from 'vdux'
import animalApis from 'animalApis'

/**
 * <ColorPicker/>
 */

export default component({
	initialState: {
		mode: 'paint'
	},

  render ({props, state, actions}) {
	  const {swatchSize = 20, animalType, dropdownHandler, paintColor, ...rest} = props
	  const {mode} = state
	  let close

	  const canPaintColor = animalApis[animalType].docs.paint.args
	  const blackAndWhite = [
	    {name: 'black', value: '#111111'},
	    {name: 'white', value: '#FFFFFF'}
	  ]

	  const palette = canPaintColor
	  	? canPaintColor[0].values
	  	: blackAndWhite

	  const btn = (
	    <Button ml={0} borderRadius={3} mr='s' {...rest} w={props.h || 'auto'}>
	      <Block
	      	border='1px solid divider'
	      	bgColor={paintColor}
	      	sq={swatchSize}/>
	    </Button>
	  )

	  return (
	  	<Block align='start stretch'>
		    <Dropdown zIndex='999' left p={4} ref={(api) => close = api.close} btn={btn}>
		      <Grid itemsPerRow='4' rowAlign='center center' columnAlign='start center'>
		        {
		        	palette.map(({value, name}) => <ColorSwatch
		        		pointer
			          size={30}
			          bgColor={value}
			          close={close}
			          name={name}
			          border={value === '#FFFFFF' ? '1px solid divider' : ''}
			          m={2}
			          clickHandler={dropdownHandler}/>)

		        }
		      </Grid>
		    </Dropdown>
	    </Block>
	  )
  }
})

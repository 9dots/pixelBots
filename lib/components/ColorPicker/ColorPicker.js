/**
 * Imports
 */

import EraseIcon from 'utils/icons/erase'
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
	  const {clickHandler, animalPaint, swatchSize = '30px', animalType, dropdownHandler, paintColor, active, ...restProps} = props
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

	  const clickToPaint = !!clickHandler


	  const btn = (
	    <Button {...restProps} ml={0} borderRadius={clickToPaint ? '0 3px 3px 0' : 3}>
	      <Block
	      	border='1px solid divider'
	      	bgColor={paintColor}
	      	sq={20}/>
	    </Button>
	  )

	  return (
	  	<Block align='start center'>
	  		<Button {...restProps} w='auto' highlight={active} px='16' borderRadius='3px 0 0 3px' borderRightWidth={0} onClick={clickHandler}>
	  			<Icon fs='l' name='format_color_fill' color='black' />
	  		</Button>
		    <Dropdown zIndex='999' p={4} ref={(api) => close = api.close} btn={btn}>
		      <Grid itemsPerRow='4' rowAlign='center center' columnAlign='start center'>
		        {
		        	palette.map(({value, name}) => <ColorSwatch
		        		pointer
			          size={swatchSize}
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

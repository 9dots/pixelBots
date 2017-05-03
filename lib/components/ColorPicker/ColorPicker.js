/**
 * Imports
 */

import {Dropdown, Grid, Button} from 'vdux-containers'
import {Block, Icon} from 'vdux-ui'
import ColorSwatch from './ColorSwatch'
import {component, element} from 'vdux'
import animalApis from 'animalApis'
import noop from '@f/noop'

/**
 * <ColorPicker/>
 */

export default component({
	initialState: {
		mode: 'paint'
	},

  render ({props, state, actions}) {
	  const {swatchSize = 20, showIcon, animalType, clickHandler, paintColor, swatchProps = {}, colors, ...rest} = props
	  const {mode} = state
	  let close

	  const canPaintColor = colors || animalApis[animalType].docs.paint.args
	  const blackAndWhite = [
	    {name: 'black', value: '#111111'},
	    {name: 'white', value: '#FFFFFF'}
	  ]

	  const palette = colors ? colors : canPaintColor
		  		? canPaintColor[0].values
		  		: blackAndWhite

	  const btn = (
	    <Button m={0} borderRadius={3} {...rest} w={props.w || props.h || 'auto'}>
	      <Block
	      	border='1px solid #DDD'
	      	bgColor={paintColor}
	      	sq={swatchSize}
	      	align='center center'
	      	{...swatchProps}>
	      	<Icon hide={!showIcon} name='colorize' fs='inherit' color={paintColor === '#FFFFFF' || paintColor === 'white' ?  'black' : 'white'}/>
	      </Block>
	    </Button>
	  )

	  return (
	  	<Block align='start stretch' pointerEvents={clickHandler ? 'normal' : 'none'}>
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
			          clickHandler={clickHandler || noop}/>)

		        }
		      </Grid>
		    </Dropdown>
	    </Block>
	  )
  }
})

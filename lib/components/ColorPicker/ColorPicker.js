/**
 * Imports
 */

import {Dropdown, Grid, Button} from 'vdux-containers'
import {Block, Icon} from 'vdux-ui'
import ColorSwatch from './ColorSwatch'
import {component, element} from 'vdux'
import palette from 'utils/palette'
import animalApis from 'animalApis'

/**
 * <ColorPicker/>
 */

export default component({
  render ({props}) {
	  const {clickHandler, animalPaint, swatchSize = '24px', animalType, permissions, setFillColor, setPaintMode, paintColor, ...restProps} = props
	  let close

	  const canPaintColor = animalApis[animalType].docs.paint.args
	  const blackAndWhite = [
	    {name: 'black', value: '#111'},
	    {name: 'white', value: '#FFF'}
	  ]

	  const btnProps = {bgColor: '#FAFAFA', border: '1px solid #CACACA', h: 40}


	  const btn = (
	    <Button onClick={setPaintMode(true)} {...btnProps} borderRadius='0 3px 3px 0' w={btnProps.h}>
	      <Block
	      	border='1px solid divider'
	      	bgColor={paintColor}
	      	sq={20}/>
	    </Button>
	  )

	  return (
	  	<Block align='start center' {...restProps}>
	  		<Button {...btnProps} px='20' borderRadius='3px 0 0 3px' borderRightWidth={0} onClick={animalPaint(paintColor)}>
	  			<Icon fs='l' name='format_color_fill' color='black' />
	  		</Button>
		    <Dropdown zIndex='999' ref={(api) => close = api.close} btn={btn}>
		      <Grid itemsPerRow='4' rowAlign='center center' columnAlign='start center'>
		        {
		        	palette.map(({value, name}) => <ColorSwatch
			          size={swatchSize}
			          bgColor={value}
			          close={close}
			          name={name}
			          clickHandler={setFillColor}/>)
		        }
		      </Grid>
		    </Dropdown>
	    </Block>
	  )
  }
})

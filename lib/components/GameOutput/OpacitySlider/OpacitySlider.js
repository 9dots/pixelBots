/**
 * Imports
 */

import ColorPicker from 'components/ColorPicker'
import {Block, Icon, Text} from 'vdux-ui'
import {component, element} from 'vdux'
import palette from 'utils/palette'
import animalApis from 'animalApis'
import Slider from 'vdux-slider'

/**
 * <Opacity Slider/>
 */

export default component({
  render ({props}) {
	  const {opacity, onChange, animalType, permissions, setFillColor, setPaintMode, paintColor} = props

	  const canPaintColor = animalApis[animalType].docs.paint.args
	  const blackAndWhite = [
	    {name: 'black', value: '#111'},
	    {name: 'white', value: '#FFF'}
	  ]

	  const btn = (
	    <Block onClick={setPaintMode(true)} align='flex-end center'>
	      <Icon fs='30px' name='format_color_fill'/>
	      <Block
	      	border='1px solid black'
	      	absolute
	      	top='25px'
	      	right='-1px'
	      	w='31px'
	      	h='8px'
	      	bgColor={paintColor}/>
	    </Block>
	  )

	  return (
	    <Block align='space-around center'>
	      <Slider
	        startValue={opacity}
	        w='220px'
	        max='1'
	        step='0.1'
	        handleChange={onChange}
	        name='opacity-slider' />
	      {
	        permissions.indexOf('Tracer Paint') > -1
	          ? <Block bgColor='white'>
	              <ColorPicker
	                zIndex='999'
	                clickHandler={setFillColor}
	                palette={canPaintColor ? palette : blackAndWhite}
	                btn={btn} />
	            </Block>
	          : <Text fontWeight='300' userSelect='none'>GOAL</Text>
	      }
	    </Block>
	  )
  }
})

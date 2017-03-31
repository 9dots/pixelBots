/**
 * Imports
 */

import ColorPicker from 'components/ColorPicker'
import {Block, Icon, Text, Slider} from 'vdux-ui'
import {component, element} from 'vdux'
import palette from 'utils/palette'
import animalApis from 'animalApis'

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
	        barProps={{border: '1px solid #BBB', h: '6'}}
	        handleProps={{bgColor: 'white'}}
	        name='opacity-slider' 
	        startValue={opacity}
	        onChange={onChange}
	        step='0.1'
	        w='220px'
	        max={1} />
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

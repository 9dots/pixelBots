/**
 * Imports
 */

import {component, element, stopPropagation} from 'vdux'
import ModalMessage from 'components/ModalMessage'
import ColorPicker from 'components/ColorPicker'
import EditLevel from 'components/EditLevel'
import Button from 'components/Button'
import palette from 'utils/palette'
import {Block, Icon} from 'vdux-ui'
import animalApis from 'animalApis'
import setProp from '@f/set-prop'

/**
 * <Edit Level Modal/>
 */

export default component({
	initialState ({props}) {
		return {
			painted: props.painted || {},
	  	color: 'black'
		}
	},
  render ({props, actions, state}) {
	  const {
	    game,
	    field,
	    title,
	    dismiss,
	    onSubmit = () => {},
	    colorPicker,
	    clickHandler,
	    ...restProps
	  } = props
	  const {color, painted} = state

	  const canPaintColor = animalApis[game.animals[0].type].docs.paint.args
	  const blackAndWhite = [
	    {name: 'black', value: '#111'},
	    {name: 'white', value: '#FFF'}
	  ]

	  const btn = (
	    <Block align='flex-end center'>
	      <Icon fs='30px' name='format_color_fill' />
	      <Block border='1px solid black' absolute top='25px' right='-1px' w='31px' h='8px' bgColor={color} />
	    </Block>
	  )

	  const footer = (
	    <Block absolute top='1em' right='1em'>
	      <Button ml='1em' bgColor='blue' onClick={[stopPropagation, dismiss, onSubmit(painted || {})]}>X</Button>
	    </Block>
	  )

	  const body = (
	    <Block column align='center center' {...restProps}>
	      <EditLevel
	        painted={painted || {}}
	        grid={field}
	        paintMode={colorPicker}
	        game={game}
	        my='0'
	        id={field}
	        size='400px'
	        hideAnimal={colorPicker}
	        clickHandler={clickHandler || actions.addPainted}>
	        {colorPicker &&
	          <Block bgColor='white' p='1em'>
	            <ColorPicker
	              zIndex='999'
	              clickHandler={actions.setFillColor}
	              palette={canPaintColor ? palette : blackAndWhite}
	              btn={btn} />
	          </Block>}
	      </EditLevel>
	    </Block>
	  )

	  return (
	    <ModalMessage
	      w='100%'
	      h='100%'
	      m='0'
	      top='0'
	      pt='5%'
	      headerColor='#666'
	      bgColor='#FAFAFA'
	      header={title}
	      dismiss={dismiss}
	      noFooter
	      body={body}>
	      {footer}
	    </ModalMessage>
	  )
  },
  reducer: {
  	setFillColor: (sate, color) => ({color}),
  	setPainted: (state, painted) => ({painted}),
  	addPainted: (state, {coord}) => ({
  		painted: setProp(
  			coord.join(','),
  			state.painted,
  			(state.painted && state.painted[coord] === state.color) ? 'white' : state.color
  		)
  	})
  }
})


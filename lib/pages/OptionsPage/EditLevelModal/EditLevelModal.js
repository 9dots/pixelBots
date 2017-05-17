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

	  const footer = (
	    <Block absolute top='1em' right='1em'>
	      <Button ml='1em' bgColor='blue' onClick={[stopPropagation, dismiss, onSubmit(painted || {})]}>X</Button>
	    </Block>
	  )

	  const body = (
	    <Block pb='xl' column align='center center' {...restProps}>
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
	          <Block bgColor='white' p='1em' border='1px solid divider' borderBottomWidth={0}>
	            <ColorPicker
	              zIndex='999'
	              animalType={game.animals[0].type}
	              clickHandler={actions.setFillColor}
	              paintColor={state.color} />
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


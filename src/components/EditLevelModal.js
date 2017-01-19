/** @jsx element */

import handleActions from '@f/handle-actions'
import createAction from '@f/create-action'
import EditLevel from '../pages/EditLevel'
import {Block, Icon} from 'vdux-ui'
import ModalMessage from './ModalMessage'
import ColorPicker from './ColorPicker'
import animalApis from '../animalApis'
import reducer, {addPainted, setFillColor} from '../reducer/drawLevelReducer'
import element from 'vdux/element'
import {palette} from '../utils'
import Button from './Button'

const initialState = ({props}) => ({
  painted: props.painted || {},
  color: 'black'
})

function render ({props, state, local}) {
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
      <Icon fs='30px' name='format_color_fill'/>
      <Block border='1px solid black' absolute top='25px' right='-1px' w='31px' h='8px' bgColor={color}/>
    </Block>
  )

  const footer = (
    <Block absolute top='1em' right='1em'>
      <Button ml='1em' bgColor='blue' onClick={[(e) => e.stopPropagation(), dismiss, () => onSubmit(painted)]}>X</Button>
    </Block>
  )

  const body = (
    <Block column align='center center' {...restProps}>
      <EditLevel
        painted={painted}
        grid={field}
        paintMode={colorPicker}
        game={game}
        my='0'
        id={field}
        size='400px'
        hideAnimal={colorPicker}
        color={color}
        clickHandler={clickHandler || local(addPainted)}>
        {colorPicker &&
          <Block bgColor='white' p='1em'>
            <ColorPicker
              zIndex='999'
              clickHandler={local((color) => setFillColor(color))}
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
      bgColor='#e5e5e5'
      header={title}
      dismiss={dismiss}
      noFooter
      body={body}>
      {footer}
    </ModalMessage>
  )
}

export default {
  initialState,
  reducer,
  render
}

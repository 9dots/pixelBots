/** @jsx element */

import handleActions from '@f/handle-actions'
import createAction from '@f/create-action'
import EditLevelModal from './EditLevelModal'
import {palette} from '../utils'
import animalApis from '../animalApis'
import ColorPicker from './ColorPicker'
import {Block, Icon, Text} from 'vdux-ui'
import {setPaint} from '../actions'
import element from 'vdux/element'
import Slider from './Slider'

function render ({props, state, local}) {
  const {opacity, onChange, game, setFillColor, setPaintMode, color} = props
  const {permissions} = game

  const canPaintColor = animalApis[game.animals[0].type].docs.paint.args
  const blackAndWhite = [
    {name: 'black', value: '#111'},
    {name: 'white', value: '#FFF'}
  ]

  const btn = (
    <Block onClick={() => setPaintMode(true)} align='flex-end center'>
      <Icon fs='30px' name='format_color_fill'/>
      <Block border='1px solid black' absolute top='25px' right='-1px' w='31px' h='8px' bgColor={color}/>
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


export default {
  render
}

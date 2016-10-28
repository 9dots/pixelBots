/** @jsx element */

import SelectAnimal from './SelectAnimal'
import {initializeGame} from '../actions'
import element from 'vdux/element'
import {Block} from 'vdux-ui'

function render ({props, state}) {
  return (
    <Block absolute top={props.top} h='calc(100% - 60px)' wide>
      <SelectAnimal
        handleSave={(type) => initializeGame(completeGame(type))}
        title='paint a picture'
        {...props} />
    </Block>
  )
}


function completeGame (type) {
  return {
    levelSize: [5, 5],
    inputType: 'icons',
    animals: [{
      type,
      sequence: [],
      current: {
        location: [0, 0],
        dir: 0,
        rot: 0
      },
      initial: {
        location: [0, 0],
        dir: 0,
        rot: 0
      }
    }]
  }
}

export default {
  render
}

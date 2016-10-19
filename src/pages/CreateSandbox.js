/** @jsx element */

import createAction from '@f/create-action'
import SelectOptions from './SelectOptions'
import SelectAnimal from './SelectAnimal'
import {initializeGame} from '../actions'
import element from 'vdux/element'
import {Block} from 'vdux-ui'
import enroute from 'enroute'

const setAnimal = createAction('SET_ANIMAL')
const setSection = createAction('SET_SECTION')

function initialState () {
  return {
    section: 'animal',
    game: {}
  }
}

function render ({props, state, local}) {
  const {game, section} = state

  const router = enroute({
    'animal': (params, props) => <SelectAnimal
      handleSave={[local(selectAnimal), local(() => setSection('options'))]}
      title=''
      {...props} />,
    'options': (params, props) => <SelectOptions
      handleSave={saveOptions}
      {...props}/>
  })

  return (
    <Block absolute top={props.top} h='calc(100% - 60px)' wide>
      {router(section, {...props, newGame: {value: game}})}
    </Block>
  )

  function selectAnimal (animal) {
    return setAnimal(animal)
  }

  function * saveOptions (options) {
    const {size, inputType, animal} = options
    const completeGame = {
      levelSize: [size, size],
      inputType,
      animals: [animal]
    }
    yield initializeGame(completeGame)
  }
}

function reducer (state, action) {
  switch (action.type) {
    case setAnimal.type:
      return {
        ...state,
        game: {
          ...state.game,
          animals: [{
            type: action.payload
          }]
        }
      }
    case setSection.type:
      return {
        ...state,
        section: action.payload
      }
  }
  return state
}

export default {
  initialState,
  reducer,
  render
}

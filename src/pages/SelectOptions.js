/** @jsx element */

import {setUrl} from 'redux-effects-location'
import createAction from '@f/create-action'
import {Block, Card, Text} from 'vdux-ui'
import {Input} from 'vdux-containers'
import validator from '../schema/level'
import Level from '../components/Level'
import {firebaseSet} from 'vdux-fire'
import Numbered from '../components/Numbered'
import element from 'vdux/element'
import OptionsForm from './OptionsForm'

const setAnimalPosition = createAction('SET_ANIMAL_POSITION')
const setInputType = createAction('SET_INPUT_TYPE')
const setSquares = createAction('SET_SQUARES')

function initialState ({props}) {
  return {
    size: 5,
    inputType: 'icons',
    errors: []
  }
}

function render ({props, state, local}) {
  const {size, inputType, animal} = state
  const {newGame, gameID, handleSave = save} = props

  if (newGame.loading) {
    return <div>... loading</div>
  }

  const game = newGame.value
  const numberSize = isNaN(size) ? size : Number(size)
  const valid = validator.levelSize(numberSize)
  const myAnimal = animal && animal.type ? animal : game.animals[0]

  return (
    <Block minHeight='500px' align='center center' tall wide>
      <Card relative p='24px' mr='10px' h='500px'>
        <OptionsForm
          game={game}
          valid={valid}
          {...state}
          handleSave={() => handleSave({size, inputType, myAnimal})}
          setInputType={local((type) => setInputType(type))}
          setSquares={local((value) => setSquares(value))}
          setAnimalPosition={local(() => setAnimalPosition({
            type: myAnimal.type,
            coords: undefined
          }))}>
          <Block align='flex-start center' my='20px'>
            <Numbered complete={myAnimal.type && myAnimal.current.location}>3</Numbered>
            <Block style={{flex: 1}}>
              <Text fontWeight='800'>Click the grid to set the starting position</Text>
            </Block>
            <Input hide name='animal' value={JSON.stringify(myAnimal)}/>
          </Block>
        </OptionsForm>
      </Card>
      <Level
        editMode
        painted={[]}
        clickHandler={local((coords) => (
          setAnimalPosition({type: myAnimal.type, coords}))
        )}
        levelSize='500px'
        numRows={valid.valid ? size : 1}
        animals={myAnimal.type ? [myAnimal] : []}
        w='auto'
        h='auto'
        numColumns={valid.valid ? size : 1}/>
    </Block>
  )

  function * save () {
    yield firebaseSet({
      method: 'update',
      ref: `/games/${gameID}`,
      value: {
        inputType,
        levelSize: [size, size],
        'animals/0': myAnimal
      }
    })
    yield setUrl(`/${gameID}/create/level`)
  }
}

function reducer (state, action) {
  switch (action.type) {
    case setSquares.type:
      return {
        ...state,
        size: action.payload
      }
    case setInputType.type:
      return {
        ...state,
        inputType: action.payload
      }
    case setAnimalPosition.type:
      const {coords, type} = action.payload
      return {
        ...state,
        animal: coords ? setAnimal(coords, type) : {}
      }
  }
  return state
}

function setAnimal (coords, type) {
  return {
    type,
    sequence: [],
    initial: {
      location: coords,
      dir: 0,
      rot: 0
    },
    current: {
      location: coords,
      dir: 0,
      rot: 0
    }
  }
}

export default {
  initialState,
  reducer,
  render
}

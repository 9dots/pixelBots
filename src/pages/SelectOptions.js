/** @jsx element */

import {Button, Icon, Input} from 'vdux-containers'
import CodeSelectDropdown from './CodeSelectDropdown'
import Number from '../components/Numbered'
import {setUrl} from 'redux-effects-location'
import createAction from '@f/create-action'
import {Block, Card, Text} from 'vdux-ui'
import Level from '../components/Level'
import {firebaseSet} from 'vdux-fire'
import element from 'vdux/element'

const setAnimalPosition = createAction('SET_ANIMAL_POSITION')
const setInputType = createAction('SET_INPUT_TYPE')
const setSquares = createAction('SET_SQUARES')

const inputProps = {
  h: '42px',
  textIndent: '8px',
  borderRadius: '2px',
  border: '2px solid #ccc'
}

function initialState () {
  return {
    size: 0,
    inputType: 'choose',
    animal: {}
  }
}

function render ({props, state, local}) {
  const {size, inputType, animal} = state
  const {newGame, gameID} = props

  if (newGame.loading) {
    return <div>... loading</div>
  }

  const game = newGame.value

  const dropdownBtn = (
    <Button h='42px' mt='10px' fs='16px' wide>
      <Text style={{flex: 1}}>{inputType}</Text>
      <Icon float='right' mt='3px' name='keyboard_arrow_down'/>
    </Button>
  )

  return (
    <Block minHeight='500px' align='center center' tall wide>
      <Card relative p='24px' mr='10px' h='500px'>
        <Block align='flex-start'>
          <Number complete={inputType && inputType !== 'choose'}>1</Number>
          <Block style={{flex: 1}}>
            <Text lineHeight='40px' fontWeight='800'>input type</Text>
            <CodeSelectDropdown
              size={size}
              btn={dropdownBtn}
              setInputType={local((type) => setInputType(type))}/>
          </Block>
        </Block>
        <Block align='flex-start' mt='20px'>
          <Number complete={size > 0 && size < 40 && typeof (parseInt(size)) === 'number'}>2</Number>
          <Block style={{flex: 1}}>
            <Text lineHeight='40px' fontWeight='800'>grid size</Text>
            <Input
              h='42px'
              inputProps={inputProps}
              value={size}
              onKeyUp={local((e) => setSquares(e.target.value))}/>
          </Block>
        </Block>
        <Block align='flex-start center' my='20px'>
          <Number complete={animal.type && animal.current.location}>3</Number>
          <Block style={{flex: 1}}>
            <Text fontWeight='800'>Click the grid to set the starting position</Text>
          </Block>
        </Block>
        <hr/>
        <Button absolute bottom='24px' h='42px' fs='16px' w='360px' onClick={save}>Save</Button>
      </Card>
      <Level
        editMode
        painted={[]}
        clickHandler={local((coords) => setAnimalPosition({type: game.animals[0].type, coords}))}
        levelSize='500px'
        numRows={size}
        animals={animal.type ? [animal] : []}
        w='auto'
        h='auto'
        numColumns={size}/>
    </Block>
  )

  function * save () {
    yield firebaseSet({
      method: 'update',
      ref: `/games/${gameID}`,
      value: {
        inputType,
        levelSize: [size, size],
        'animals/0': animal
      }
    })
    yield setUrl(`/${gameID}/create/level`)
  }
}

function reducer (state, action) {
  switch (action.type) {
    case setSquares.type:
      const num = parseInt(action.payload)
      if (num > 0 && num < 40) {
        return {
          ...state,
          size: action.payload
        }
      }
      break
    case setInputType.type:
      return {
        ...state,
        inputType: action.payload
      }
    case setAnimalPosition.type:
      const {coords, type} = action.payload
      return {
        ...state,
        animal: {
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
  }
  return state
}

export default {
  initialState,
  reducer,
  render
}

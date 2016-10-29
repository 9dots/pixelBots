/** @jsx element */

import CodeSelectDropdown from './CodeSelectDropdown'
import AnimalDropdown from './AnimalDropdown'
import {Button, Input} from 'vdux-containers'
import {Block, Card, Icon, Text} from 'vdux-ui'
import {swapMode, updateSize, setAnimal} from '../actions'
import createAction from '@f/create-action'
import element from 'vdux/element'

const min = 2
const max = 50
const setError = createAction('SET_ERROR')

function initialState ({local}) {
  return {
    message: '',
    actions: {
      checkE: local(checkError)
    }
  }
}

function render ({props, state}) {
  const {inputType, levelSize, type} = props
  const {message, actions} = state
  const {checkE} = actions

  const dropdownBtn = (
    <Button w='120px' h='42px' fs='16px'>
      <Text flex>{inputType}</Text>
      <Icon relative right='0' mt='3px' name='keyboard_arrow_down'/>
    </Button>
  )

  const animalBtn = (
    <Button w='120px' h='42px' fs='16px'>
      <Text flex>{type}</Text>
      <Icon relative right='0' mt='3px' name='keyboard_arrow_down'/>
    </Button>
  )

  return (
    <Card wide p='22px'>
      <Text fs='m' fontWeight='800'>Control Panel</Text>
      <hr/>
      <Block mt='20px' align='start center'>
        <Text w='120px' lineHeight='40px' fontWeight='800' mr='10px'>select animal:</Text>
        <AnimalDropdown
          btn={animalBtn}
          clickHandler={(name) => setAnimal(name)}
          value={type}
          name='setAnimal'
          />
      </Block>
      <Block mt='20px' align='start center'>
        <Text w='120px' lineHeight='40px' fontWeight='800' mr='10px'>input type:</Text>
        <CodeSelectDropdown
          name='inputType'
          value={inputType}
          btn={dropdownBtn}
          setInputType={((type) => swapMode(type))}/>
      </Block>
      <Block mt='20px' align='start center'>
        <Text w='120px' lineHeight='40px' fontWeight='800' mr='10px'>level size:</Text>
        <Input
          inputProps={{h: '42px', textIndent: '8px'}}
          w='120px'
          h='42px'
          invalid={message}
          message={message}
          errorPlacement='right'
          onKeyUp={[checkE, sizeUpdate]}
          value={levelSize}/>
      </Block>
    </Card>
  )

  function sizeUpdate (e) {
    const val = e.target.value
    if (within(val)) return updateSize(val)
  }
}

function checkError (e) {
  return within(e.target.value)
    ? setError('')
    : setError(`Please choose a number between ${min} and ${max}`)
}

function within (val) {
  return val >= min && val <= max
}

function reducer (state, action) {
  switch (action.type) {
    case setError.type:
      return {
        ...state,
        message: action.payload
      }
  }
  return state
}

export default {
  reducer,
  initialState,
  render
}

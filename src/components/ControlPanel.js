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
    <Card wide p='22px' align='space-around center'>
      <Block align='start center'>
        <Text fs='m' lineHeight='40px' fontWeight='800' color='#666' mr='1em'>SELECT ANIMAL:</Text>
        <AnimalDropdown
          btn={animalBtn}
          clickHandler={(name) => setAnimal(name)}
          value={type}
          name='setAnimal'
          />
      </Block>
      <Block align='start center'>
        <Text fs='m' lineHeight='40px' fontWeight='800' color='#666' mr='1em'>CODE TYPE:</Text>
        <CodeSelectDropdown
          name='inputType'
          value={inputType}
          btn={dropdownBtn}
          setInputType={((type) => swapMode(type))}/>
      </Block>
      <Block align='start center'>
        <Text fs='m' lineHeight='40px' fontWeight='800' color='#666' mr='1em'>LEVEL SIZE:</Text>
        <Input
          inputProps={{p: '12px', borderWidth: '2px', border: '#ccc'}}
          w='120px'
          mb='0'
          h='42px'
          invalid={message}
          message={message}
          errorPlacement='bottom'
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

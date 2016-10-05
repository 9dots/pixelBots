/** @jsx element */

import element from 'vdux/element'
import {Block, Card, Text} from 'vdux-ui'
import {Button, debounceAction, Dropdown, Icon, Input, MenuItem} from 'vdux-containers'
import {setUrl} from 'redux-effects-location'
import Level from '../components/Level'
import createAction from '@f/create-action'
import debounce from '@f/debounce'

const setSquares = createAction('SET_SQUARES')
const setInputType = createAction('SET_INPUT_TYPE')

function initialState () {
  return {
    size: 5,
    inputType: 'icons'
  }
}

function render ({props, state, local}) {
  const {size, inputType} = state

  const dropdownBtn = (
    <Button h='42px' mt='10px' fs='16px' wide>
      <Text style={{flex: 1}}>{inputType}</Text>
      <Icon float='right' mt='3px' name='keyboard_arrow_down'/>
    </Button>
  )

  return (
    <Block minHeight='500px' align='center center' tall wide>
      <Card p='24px' mr='10px' h='500px'>
        <Block>
          <Text fontWeight='800'>input type</Text>
          <Dropdown
            btn={dropdownBtn}
            zIndex='999'
            value={size}
            onKeyUp={local((e) => setSquares(e.target.value), 2000)}>
            <MenuItem
              onClick={local(() => setInputType('icons'))}>
              icons
            </MenuItem>
            <MenuItem
              onClick={local(() => setInputType('code'))}>
              code
            </MenuItem>
          </Dropdown>
        </Block>
        <Block mt='20px'>
          <Text fontWeight='800'>grid size</Text>
          <Input
            h='42px'
            mt='10px'
            inputProps={{
              h: '42px',
              textIndent: '8px',
              borderRadius: '2px',
              border: '2px solid #ccc'
            }}
            value={size}
            onKeyUp={local((e) => setSquares(e.target.value))}/>
        </Block>
        <Button h='42px' mt='10px' fs='16px' wide onClick={() => setUrl('/')}>Save</Button>
      </Card>
      <Level
        editMode
        painted={[]}
        levelSize='500px'
        numRows={size}
        w='auto'
        h='auto'
        numColumns={size}/>
    </Block>
  )
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
  }
  return state
}

export default {
  initialState,
  reducer,
  render
}

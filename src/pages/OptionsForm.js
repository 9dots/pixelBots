/** @jsx element */

import element from 'vdux/element'
import Form from 'vdux-form'
import {Block, Button, Icon, Input, Text} from 'vdux-containers'
import validator from '../schema/level'
import Numbered from '../components/Numbered'
import CodeSelectDropdown from '../components/CodeSelectDropdown'

const inputProps = {
  h: '42px',
  textIndent: '8px',
  borderRadius: '2px',
  border: '2px solid #ccc'
}

function render ({props, children}) {
  const {
    inputType,
    game,
    size,
    valid,
    animal,
    handleSave,
    setInputType,
    setSquares,
    setAnimalPosition
  } = props

  const dropdownBtn = (
    <Button h='42px' mt='10px' fs='16px' wide>
      <Text style={{flex: 1}}>{inputType}</Text>
      <Icon float='right' mt='3px' name='keyboard_arrow_down'/>
    </Button>
  )

  return (
    <Form
      validate={validator.game}
      id='options'
      cast={cast}
      onSubmit={() => handleSave({size, inputType, animal})}>
      <Block align='flex-start'>
        <Numbered complete={inputType && inputType !== 'choose'}>1</Numbered>
        <Block style={{flex: 1}}>
          <Text lineHeight='40px' fontWeight='800'>input type</Text>
          <CodeSelectDropdown
            name='inputType'
            value={inputType}
            btn={dropdownBtn}
            setInputType={((type) => setInputType(type))}/>
        </Block>
      </Block>
      <Block align='flex-start' mt='20px'>
        <Numbered complete={valid.valid}>2</Numbered>
        <Block style={{flex: 1}}>
          <Text lineHeight='40px' fontWeight='800'>grid size</Text>
          <Input
            h='42px'
            name='levelSize'
            inputProps={inputProps}
            value={size}
            onKeyUp={[
              (e) => setSquares(e.target.value),
              (coords) => (
                setAnimalPosition({
                  type: game.animals[0].type,
                  coords: undefined
                })
              )
            ]}/>
        </Block>
      </Block>
      {children}
      <hr/>
      <Button
        absolute
        type='submit'
        bottom='24px'
        form='options'
        value='Submit'
        h='42px'
        fs='16px'
        w='360px'>
        Save
      </Button>
    </Form>
  )
}

function cast (fields) {
  const {levelSize, animal} = fields
  return {
    ...fields,
    animal: JSON.parse(animal),
    levelSize: isNaN(levelSize) ? levelSize : Number(levelSize)
  }
}

export default {
  render
}

/** @jsx element */

import EditableTextField from '../components/EditableTextField'
import EditableLevelItem from '../components/EditableLevelItem'
import PermissionsField from '../components/PermissionsField'
import CodeDropdown from '../components/CodeSelectDropdown'
import AnimalDropdown from '../components/AnimalDropdown'
import StartCodeItem from '../components/StartCodeItem'
import DropdownField from '../components/DropdownField'
import {Block, Icon, Text} from 'vdux-ui'
import Button from '../components/Button'
import {maybeAddToArray} from '../utils'
import validator from '../schema/level'
import EditLevel from './EditLevel'
import element from 'vdux/element'

function render ({props, state, children}) {
  const {selectedLine, onEdit} = props
  const type = props.animals[0].type
  const inputType = props.inputType

  const animalBtn = (
    <Button w='160px' h='42px' fs='16px' px='16px'>
      <Block wide align='space-between center'>
        <Text textAlign='left' flex>{type}</Text>
        <Icon relative right='0' mt='3px' name='keyboard_arrow_down' />
      </Block>
    </Button>
  )

  const dropdownBtn = (
    <Button w='160px' h='42px' fs='16px' px='16px'>
      <Block wide align='space-between center'>
        <Text textAlign='left' flex>{inputType !== 'code' ? inputType : 'javascript'}</Text>
        <Icon float='right' mt='3px' name='keyboard_arrow_down' />
      </Block>
    </Button>
  )

  return (
    <Block mx='20px' bgColor='white' border='1px solid #e0e0e0'>
      <Block wide>
        <EditableTextField
          onSubmit={({title}) => onEdit({title})}
          value={props.title || 'Untitled'}
          validate={({title}) => validator.title(title)}
          field='title'
          label='Name' />
        <EditableTextField
          onSubmit={({description}) => onEdit({description})}
          value={props.description || ''}
          validate={({description}) => validator.description(description)}
          textarea
          field='description'
          label='Description' />
        <EditableTextField
          onSubmit={(({levelSize}) => onEdit({
            levelSize: [levelSize, levelSize],
            'animals/0/current/location': [0, 0],
            'animals/0/initial/location': [0, 0]
          }))}
          value={props.levelSize[0]}
          validate={({levelSize}) => validator.levelSize(isNaN(levelSize) ? levelSize : Number(levelSize))}
          field='levelSize'
          label='Grid Size' />
        <DropdownField h='85px' label='Code Type'>
          <CodeDropdown
            name='inputType'
            value={inputType}
            btn={dropdownBtn}
            setInputType={((type) => onEdit({
              inputType: type,
              'startCode': [],
              'animals/0/sequence': []
            }))} />
        </DropdownField>
        <DropdownField h='85px' label='Animal'>
          <AnimalDropdown
            btn={animalBtn}
            clickHandler={(name) => onEdit({
              'animals/0/type': name,
              initialPainted: 0,
              targetPainted: 0,
              painted: 0
            })}
            value={type}
            name='setAnimal' />
        </DropdownField>
        <EditableLevelItem
          game={props}
          label='Target Grid'
          title='Click to paint the target grid'
          field='targetPainted'
          painted={props.targetPainted}
          onSubmit={(data) => onEdit({targetPainted: data})}
          colorPicker
          value={getLevel({painted: props.targetPainted, hideAnimal: true, game: props})} />
        <EditableLevelItem
          game={props}
          label='Start Grid'
          title='Click to paint the starting grid'
          field='initialPainted'
          painted={props.initialPainted}
          onSubmit={(data) => onEdit({initialPainted: data, painted: data})}
          colorPicker
          value={getLevel({painted: props.initialPainted, hideAnimal: true, game: props})} />
        <EditableLevelItem
          title='Click the grid to set the starting position'
          game={props}
          label='Initial Position'
          field='initPosition'
          clickHandler={({coord}) => onEdit({
            'animals/0/current/location': coord,
            'animals/0/initial/location': coord
          })}
          value={getLevel({painted: [], game: props})} />
        <StartCodeItem
          label='Add Start Code'
          selectedLine={selectedLine}
          onSubmit={(startCode) => onEdit({startCode})}
          game={props} />
        <PermissionsField
          label='Student Permissions'
          handleClick={(field) => onEdit({
            permissions: maybeAddToArray(field, props.permissions)
          })}
          checked={props.permissions}
          fields={['Run Button', 'Edit Code', 'Tracer Paint']} />
      </Block>
      {children}
    </Block>
  )
}

function getLevel ({painted, hideAnimal, game}) {
  return <Block display='block' w='82px'>
    <EditLevel
      my='0'
      painted={painted}
      hideAnimal={hideAnimal}
      size='80px'
      game={game} />
  </Block>
}

export default {
  render
}

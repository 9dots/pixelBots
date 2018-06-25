/**
 * Imports
 */

import { Table, TableHeader, TableRow, TableCell, Block, Text } from 'vdux-ui'
import { Checkbox, Dropdown, MenuItem, Toggle, Input } from 'vdux-containers'
import { paints, turning, movements, structural, animations } from './options'
import StretchDropdown from 'components/StretchDropdown'
import { component, element, decodeValue } from 'vdux'
import DropdownButton from 'components/DropdownButton'
import DropdownField from 'components/DropdownField'
import colors, { blackAndWhite } from 'utils/palette'
import EditableTextField from './EditableTextField'
import CodeDropdown from 'components/CodeDropdown'
import ConfirmModal from 'components/ConfirmModal'
import TypeDropdown from 'components/TypeDropdown'
import BlockIcon from 'components/BlockIcon'
import validator from 'schema/level'
import range from '@f/range'

const stretchGoals = {
  write: {
    lineLimit: {
      label: 'Lines',
      indicator: 'lloc'
    },
    stepLimit: {
      label: 'Steps',
      indicator: 'steps'
    }
  },
  debug: {
    modLimit: {
      label: 'Changes',
      indicator: 'modifications'
    }
  },
  read: {
    errorLimit: {
      label: 'Errors',
      indicator: 'invalidCount'
    }
  }
}

/**
 * Constants
 */

const rowProps = {
  fs: 's',
  py: 's',
  hoverProps: { bgColor: 'rgba(blue, .04)' },
  border: '1px solid #e0e0e0',
  borderBottomWidth: 0
}

const inputProps = {
  placeholder: '--',
  inputProps: { p: 5, textAlign: 'center', h: 32 },
  m: '0 0 0 12px',
  w: 60
}

/**
 * <OptionsPage/>
 */

export default component({
  render ({ props, actions, children }) {
    const {
      animals,
      inputType,
      showModal,
      type,
      updateGame,
      palette,
      capabilities = {},
      stretch = {},
      coordinates = {},
      inventorySize = 'None'
    } = props

    if (!animals) return <span />

    const { hard } = stretch
    const checkProps = {
      checkProps: { borderRadius: 5, mr: true, sq: 24, fs: 's', bold: true }
    }

    function updateCapability (key, val) {
      return updateGame({
        capabilities: {
          ...capabilities,
          [key]: capabilities[key] ? null : val
        }
      })
    }

    return (
      <Block wide mx='auto' maxWidth={750}>
        <Block>
          <EditableTextField
            onSubmit={actions.update(({ title }) => ({ title }))}
            value={props.title}
            validate={({ title }) => validator.title({ title })}
            field='title'
            label='Name'
            {...rowProps} />
          <EditableTextField
            onSubmit={actions.update(({ description }) => ({ description }))}
            value={props.description}
            validate={({ description }) =>
              validator.description({ description })}
            placeholder=''
            textarea
            field='description'
            label='Description'
            {...rowProps} />
          <DropdownField label='Directions modal' {...rowProps}>
            <Toggle
              checked={showModal}
              onChange={updateGame({ showModal: !showModal })} />
          </DropdownField>
          <DropdownField label='Challenge Mode' {...rowProps}>
            <TypeDropdown
              btn={val => <DropdownButton text={val} />}
              clickHandler={actions.update(type => ({
                type,
                imageUrl: getImageUrl(type),
                initialPainted: null,
                targetPainted: null,
                painted: null,
                advanced: false,
                userDocs: null,
                stretch: null,
                animals: props.animals.map(a => ({ ...a, sequence: [] }))
              }))}
              value={type}
              name='setType' />
          </DropdownField>
          <DropdownField label='Code Type' {...rowProps}>
            <CodeDropdown
              name='inputType'
              value={inputType}
              btn={
                <DropdownButton
                  text={inputType !== 'code' ? inputType : 'javascript'} />
              }
              setInputType={actions.update(type => ({
                inputType: type,
                startCode: [],
                userDocs: null,
                animals: animals.map(a => ({
                  ...a,
                  sequence: inputType === 'code' ? '' : []
                })),
                solution: (props.solution || []).map(a => ({
                  ...a,
                  sequence: type === 'code' ? '' : []
                }))
              }))} />
          </DropdownField>
          <DropdownField
            disabled={!stretchGoals[type]}
            label='Stretch Goal'
            {...rowProps}>
            <StretchDropdown
              options={stretchGoals[type]}
              btn={
                <DropdownButton
                  text={
                    stretch.type
                      ? stretchGoals[type][stretch.type].label
                      : 'None'
                  } />
              }
              onSelect={actions.update(stretchType => ({
                stretch: {
                  ...stretchGoals[type][stretchType],
                  type: stretchType,
                  value: null
                }
              }))} />
            <Input
              hide={!stretch.type}
              {...inputProps}
              onKeyUp={decodeValue(actions.setStretch)}
              value={stretch.value} />
          </DropdownField>
          <DropdownField
            disabled={!stretchGoals[type] || !stretch.type}
            label='Enforce Stretch Goal'
            {...rowProps}>
            <Toggle
              checked={hard}
              onChange={updateGame({ 'stretch/hard': !hard })} />
          </DropdownField>
          <DropdownField
            label='Show Coordinates'
            {...rowProps}
            borderBottomWidth='1'>
            <Toggle
              checked={coordinates}
              onChange={updateGame({ 'coordinates': !coordinates })} />
          </DropdownField>
          <DropdownField mt label='Colors' {...rowProps}>
            <Checkbox
              {...checkProps}
              label='Paint Colors'
              checked={palette.length > 2}
              onChange={actions.togglePalette}
              ml='s' />
          </DropdownField>
          <DropdownField label='Paints' {...rowProps}>
            <Table
              w='60%'
              ml={-12}
              borderCollapse='collapse'
              border='1px solid divider'>
              {paints.map((paint, i) => {
                const name = paint.replace(' ', '')
                return (
                  <TableRow key={i} bgColor={i % 2 ? 'white' : '#FAFAFA'}>
                    <TableCell py='s' px fontFamily='monospace'>
                      <Checkbox
                        {...checkProps}
                        label={
                          <Block my={-4} align='start center'>
                            Paint <BlockIcon ml='s' name={name} color='#555' />
                          </Block>
                        }
                        checked={props.capabilities[name]}
                        onChange={updateCapability(name, [true])} />
                    </TableCell>
                  </TableRow>
                )
              })}
              <TableRow bgColor='#FAFAFA'>
                <TableCell py='s' px fontFamily='monospace'>
                  <Checkbox
                    {...checkProps}
                    label={
                      <Block my={-4} align='start center'>
                        Toggle <BlockIcon
                          ml='s'
                          name='toggle'
                          color='#555' />
                      </Block>
                    }
                    checked={props.capabilities.toggle}
                    onChange={updateCapability('toggle', true)} />
                </TableCell>
              </TableRow>
            </Table>
          </DropdownField>
          <DropdownField label='Movement' {...rowProps} align='start start'>
            <Table
              w='60%'
              ml={-12}
              borderCollapse='collapse'
              border='1px solid divider'>
              <TableRow>
                <TableHeader py='s' px textAlign='left' fw='normal'>
                  Direction
                </TableHeader>
                <TableHeader py='s' px textAlign='right' fw='normal'>
                  Enable Arguments
                </TableHeader>
              </TableRow>
              {movements.map((dir, i) => (
                <TableRow key={dir} bgColor={i % 2 ? 'white' : '#FAFAFA'}>
                  <TableCell py='s' px fontFamily='monospace'>
                    <Checkbox
                      {...checkProps}
                      checked={!!capabilities[dir]}
                      onChange={updateCapability(dir, true)}
                      label={dir} />
                  </TableCell>
                  <TableCell py='s' pl>
                    <Toggle
                      float='right'
                      checked={Array.isArray(capabilities[dir])}
                      disabled={!capabilities[dir]}
                      opacity={capabilities[dir] ? 1 : 0.4}
                      pointerEvents={capabilities[dir] ? 'all' : 'none'}
                      onChange={updateGame({
                        capabilities: {
                          ...capabilities,
                          [dir]: Array.isArray(capabilities[dir])
                            ? true
                            : [true]
                        }
                      })} />
                  </TableCell>
                </TableRow>
              ))}
              <TableRow bgColor={'white'}>
                <TableCell py='s' px fontFamily='monospace'>
                  <Checkbox
                    {...checkProps}
                    checked={!!capabilities.moveTo}
                    onChange={updateCapability('moveTo', [true, true])}
                    label='moveTo' />
                </TableCell>
                <TableCell py='s' pl />
              </TableRow>
            </Table>
          </DropdownField>
          <DropdownField label='Turning' {...rowProps}>
            <Table
              w='60%'
              ml={-12}
              borderCollapse='collapse'
              border='1px solid divider'>
              <TableRow>
                <TableHeader py='s' px textAlign='left' fw='normal'>
                  Direction
                </TableHeader>
              </TableRow>
              {turning.map((dir, i) => (
                <TableRow key={dir} bgColor={i % 2 ? 'white' : '#FAFAFA'}>
                  <TableCell py='s' px fontFamily='monospace'>
                    <Checkbox
                      {...checkProps}
                      checked={!!capabilities[dir]}
                      onChange={updateCapability(dir, true)}
                      label={dir} />
                  </TableCell>
                </TableRow>
              ))}
            </Table>
          </DropdownField>
          <DropdownField label='Memory' {...rowProps}>
            <Table
              w='60%'
              ml={-12}
              borderCollapse='collapse'
              border='1px solid divider'>
              <TableRow>
                <TableCell px py='s' align='start center'>
                  <Block mr>Memory Size:</Block>
                  <Dropdown btn={<DropdownButton text={inventorySize} />}>
                    <MenuItem onClick={updateGame({ inventorySize: null })}>
                      None
                    </MenuItem>
                    {range(1, 11).map(val => (
                      <MenuItem
                        key={val}
                        onClick={updateGame({ inventorySize: val })}>
                        {val}
                      </MenuItem>
                    ))}
                  </Dropdown>
                  <Input
                    hide={!stretch.type}
                    {...inputProps}
                    onKeyUp={decodeValue(actions.setStretch)}
                    value={stretch.value} />
                </TableCell>
              </TableRow>
              {['pickUp', 'place'].map((cap, i) =>
                <TableRow key={cap} bgColor={i % 2 ? 'white' : '#FAFAFA'}> 
                  <TableCell px py='s'>
                    <Checkbox
                      {...checkProps}
                      checked={!!capabilities[cap]}
                      onChange={updateCapability(cap, true)}
                      label={<Text>{cap}</Text>} />
                  </TableCell>
                </TableRow>
              )}
              <TableRow bgColor='#FAFAFA'>
                <TableCell px py='s'>
                  <Checkbox
                    {...checkProps}
                    checked={!!props.numberGrid}
                    onChange={updateGame({
                      numberGrid: props.numberGrid ? null : true
                    })}
                    label={<Text>numberGrid</Text>} />
                </TableCell>
              </TableRow>
            </Table>
          </DropdownField>
          <DropdownField label='Structural' {...rowProps}>
            <Table
              w='60%'
              ml={-12}
              borderCollapse='collapse'
              border='1px solid divider'>
              {structural.map(({key, label}, i) =>
                <TableRow key={key} bgColor={!(i % 2) ? 'white' : '#FAFAFA'}>
                  <TableCell px py='s'>
                    <Checkbox
                      {...checkProps}
                      checked={!!capabilities[key]}
                      onChange={updateCapability(key, [true])}
                      label={<Text>{label || key}</Text>} />
                  </TableCell>
                </TableRow>
              )}
            </Table>
          </DropdownField>
          <DropdownField disabled={inputType === 'icons'} label='Animations' {...rowProps} borderBottomWidth='1'>
            <Table
              w='60%'
              ml={-12}
              borderCollapse='collapse'
              border='1px solid divider'>
              { animations.map((cap, i) =>
                <TableRow key={cap} bgColor={!(i % 2) ? 'white' : '#FAFAFA'}>
                  <TableCell px py='s'>
                    <Checkbox
                      {...checkProps}
                      checked={!!capabilities[cap]}
                      onChange={updateCapability(cap, [true])}
                      label={<Text>{cap}</Text>} />
                  </TableCell>
                </TableRow>)
              }
            </Table>
          </DropdownField>
        </Block>
        <Block mt='l'>{children}</Block>
      </Block>
    )
  },
  controller: {
    * update ({ props }, fn, type) {
      const data = fn(type)
      yield props.updateGame({
        ...data
      })
    },
    * setStretch ({ actions, props }, value) {
      yield actions.update(() => ({
        stretch: {
          ...props.stretch,
          value
        }
      }))
    },
    * togglePalette ({ actions, props, context }) {
      const {
        initialPainted = {},
        targetPainted = {},
        capabilities = {},
        updateGame,
        palette
      } = props

      const isPainted =
        Object.keys(initialPainted).length || Object.keys(targetPainted).length

      if (isPainted) {
        yield context.openModal(() => (
          <ConfirmModal
            title='Clear your grids?'
            body={
              <Block lh='1.5em' mx={-16}>
                Changing the palette will clear{' '}
                <Text bold italic color='red'>
                  {' '}
                  everything{' '}
                </Text>{' '}
                you've painted on your{' '}
                <Text bold italic color='red'>
                  start and target{' '}
                </Text>{' '}
                grids. After you do this, make sure any start code you've added
                still makes sense with the new palette.
              </Block>
            }
            onSubmit={toggle} />
        ))
      } else {
        yield toggle
      }


      function * toggle () {
        yield updateGame({
          initialPainted: null,
          targetPainted: null,
          capabilities: {
            ...capabilities,
            ...paints.reduce((acc, paint) => {
              const name = paint.replace(' ', '')
              return {
                ...acc,
                [name]: capabilities[name]
                  ? palette && palette.length === 2 ? [true] : true
                  : null
              }
            }, {})
          },
          palette: palette && palette.length === 2 ? colors : blackAndWhite
        })
      }
    }
  }
})

function getImageUrl (type) {
  const base = '/animalImages/'
  switch (type) {
    case 'read':
      return base + 'readImage.png'
    case 'project':
      return base + 'projectImage.png'
    case 'debug':
      return base + 'debugImage.png'
    default:
      return base + 'teacherBot.png'
  }
}

/**
 * Imports
 */

import { Input, MenuItem, Dropdown } from 'vdux-containers'
import ColorPicker from 'components/ColorPicker'
import { component, element } from 'vdux'
import { Block } from 'vdux-ui'

/**
 * Constants
 */

const width = 60
const pad = 8
const innerWidth = width - pad * 2
const innerHeight = 40 - pad * 2
const inputProps = { textAlign: 'center', h: innerHeight }
const ddProps = {
  zIndex: '999',
  wide: true,
  maxHeight: 200,
  overflowY: 'auto'
}

/**
 * <BlockArgument/>
 */

export default component({
  render ({ props, actions }) {
    const { arg, value, scopeValues = [], readOnly, ...rest } = props
    if (!arg || arg.type === 'function') return <Block />

    return (
      <Block
        class='block-argument'
        w={width}
        ml='s'
        align='center center'
        minWidth={width}
        px={pad}
        {...rest}>
        {arg.values ? (
          <SelectDropdown
            setArgument={actions.setArgument}
            type={arg.type}
            scopeValues={scopeValues}
            readOnly={readOnly}
            value={value}
            values={arg.values}
            name={arg.name} />
        ) : (
          <ValueInput value={value.value} setArgument={actions.setArgument} />
        )}
      </Block>
    )
  },
  controller: {
    * setArgument ({ props }, type, value) {
      yield props.setArgument({ type, value: value })
    }
  }
})

/**
 * <SelectDropdown/>
 */

const SelectDropdown = component({
  render ({ props }) {
    const {
      name,
      value,
      values,
      setArgument,
      type,
      scopeValues,
      readOnly
    } = props

    const scopeMenu = scopeValues
      .filter(value => value.type === type)
      .map(value => (
        <MenuItem
          onClick={!readOnly && setArgument('variable', value.name)}
          key={value.name}>
          {value.name}
        </MenuItem>
      ))

    if (name === 'color') {
      return (
        <ColorPicker
          dropdownTip
          borderRadius={99}
          colors={values}
          p={0}
          clickHandler={setArgument(type)}
          paintColor={value.value || value}
          swatchProps={{
            h: innerHeight,
            w: innerWidth,
            fs: 16,
            borderRadius: 99
          }}>
          {scopeMenu}
        </ColorPicker>
      )
    }

    if (readOnly) {
      return <ValueInput value={value} setArgument={!readOnly && setArgument} />
    }

    return (
      <Dropdown
        {...ddProps}
        btn={
          <ValueInput
            value={value.value || value}
            setArgument={!readOnly && setArgument} />
        }>
        {values.map(value => (
          <MenuItem onClick={!readOnly && setArgument(type, value)} fs='s'>
            <Block>{value}</Block>
          </MenuItem>
        ))}
        {scopeMenu}
      </Dropdown>
    )
  }
})

/**
 * <ValueInput/>
 */

const ValueInput = component({
  render ({ props }) {
    const { value, setArgument } = props

    return (
      <Input
        m='0'
        fs='12px'
        maxWidth='300px'
        h={innerHeight}
        w={innerWidth}
        color='#333'
        value={value}
        readonly
        inputProps={inputProps} />
    )
  }
})

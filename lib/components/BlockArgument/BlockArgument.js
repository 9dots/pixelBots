/**
 * Imports
 */

import { Input, MenuItem, Dropdown } from 'vdux-containers'
import ColorPicker from 'components/ColorPicker'
import { component, element, decodeValue } from 'vdux'
import { Block, Grid } from 'vdux-ui'

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
  maxHeight: 200,
  overflowY: 'auto'
}

/**
 * <BlockArgument/>
 */

export default component({
  render ({ props, actions }) {
    const { arg, value = {}, scopeValues = [], readOnly, ...rest } = props
    if (!arg || arg.type === 'function') return <Block />

    return (
      <Block
        class='block-argument'
        w='auto'
        ml='s'
        align='center center'
        width={width}
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
          border='1px solid divider'
          m={2}
          textAlign='center'
          px='xxs'
          onClick={!readOnly && setArgument('variable', value.name)}
          key={value.name}
          fontFamily='monospace'>
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
          clickHandler={!readOnly && setArgument(type)}
          asText={value.type === 'variable'}
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
      return (
        <ValueInput
          value={value}
          readOnly
          setArgument={!readOnly && setArgument} />
      )
    }

    return (
      <Dropdown
        {...ddProps}
        p={4}
        btn={
          <ValueInput
            value={value.value || value}
            type={type}
            setArgument={!readOnly && setArgument} />
        }>
        <Grid itemsPerRow='3'>
          {values.map(value => (
            <MenuItem
              border='1px solid divider'
              m={2}
              onClick={!readOnly && setArgument(type, value)}
              fs='s'>
              <Block>{value}</Block>
            </MenuItem>
          ))}
        </Grid>
        {scopeMenu}
      </Dropdown>
    )
  }
})

/**
 * <ValueInput/>
 */

const ValueInput = component({
  render ({ props, actions }) {
    const { value, setArgument, type, readOnly } = props

    return (
      <Input
        m='0'
        fs='12px'
        maxWidth='300px'
        h={innerHeight}
        onBlur={decodeValue(actions.set)}
        minWidth={innerWidth}
        size={value.toString().length || 1}
        color='#333'
        value={value}
        readonly={readOnly}
        pointer
        inputProps={{
          ...inputProps,
          border: '1px solid #555'
        }} />
    )
  },
  controller: {
    * set ({ props }, value) {
      const { type, setArgument } = props

      if (setArgument && value.toString() !== props.value.toString()) {
        yield setArgument(type, value)
      }
    }
  }
})

/**
 * Imports
 */

import {Input, MenuItem, Dropdown, Grid} from 'vdux-containers'
import {decodeValue, component, element} from 'vdux'
import ColorPicker from 'components/ColorPicker'
import {Block} from 'vdux-ui'

/**
 * Constants
 */

const width = 60
const pad = 8
const innerWidth = width - pad * 2
const innerHeight = 40 - pad * 2
const inputProps = {textAlign: 'center', h: innerHeight}
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
  render ({props}) {
    const {arg, value, setArgument, readOnly, ...rest} = props

    if (arg.type === 'function') return <Block/>

    return (
      <Block class='block-argument' w={width} ml='s' align='center center' minWidth={width} align='center center' px={pad} {...rest}>
          {
            arg.values
              ? <SelectDropdown readOnly={readOnly} name={arg.name} value={value} values={arg.values} setArgument={setArgument} />
              : <ValueInput readOnly={readOnly} value={value} setArgument={setArgument} />
          }
      </Block>
    )
  }
})

/**
 * <SelectDropdown/>
 */

const SelectDropdown = component({
  render ({props}) {
    const {name, value, values, setArgument, readOnly} = props

    if (name === 'color') return <ColorPicker borderRadius={99} colors={values} p={0} clickHandler={setArgument} paintColor={value} swatchProps={{h: innerHeight, w: innerWidth, fs: 16, borderRadius: 99}} />

    if (readOnly) {
      return <ValueInput readOnly={readOnly} value={value} setArgument={!readOnly && setArgument} />
    }

    return (
      <Dropdown
        {...ddProps}
        btn={<ValueInput value={value} setArgument={!readOnly && setArgument} />}>
        {
          values.map(value => (
            <MenuItem onClick={!readOnly && setArgument(value)} fs='s'>
              <Block>{value}</Block>
            </MenuItem>
          ))
        }
      </Dropdown>
    )
  }
})

/**
 * <ValueInput/>
 */

const ValueInput = component({
  render ({props}) {
    const {value, setArgument, readOnly} = props

    return <Input
          m='0'
          fs='12px'
          maxWidth='300px'
          h={innerHeight}
          w={innerWidth}
          color='#333'
          value={value}
          readonly={readOnly}
          inputProps={inputProps}
          onKeyup={!readOnly && decodeValue(setArgument)} />
  }
})

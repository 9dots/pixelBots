/**
 * Imports
 */

import {Input, MenuItem, Dropdown, Grid} from 'vdux-containers'
import {decodeValue, component, element} from 'vdux'
import {Block} from 'vdux-ui'

/**
 * Constants
 */

const inputProps = {textAlign: 'center'}
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
    const {arg, value, setArgument, ...rest} = props

    if (arg.type === 'function') return <Block/>

    return (
      <Block w='80px' bgColor='#333' align='center center' minWidth='80px' align='center center' px={10} {...rest}>
          {
            arg.values
              ? <SelectDropdown name={arg.name} value={value} values={arg.values} setArgument={setArgument} />
              : <ValueInput value={value} setArgument={setArgument} />
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
    const {name, value, values, setArgument} = props

    if (name === 'color') return <ColorSelect {...props} />

    return (
      <Dropdown
        {...ddProps}
        btn={<ValueInput value={value} setArgument={setArgument} />}>
        {
          values.map(value => (
            <MenuItem onClick={setArgument(value)} fs='s'>
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
    const {value, setArgument} = props

    return <Input
          autofocus
          m='0'
          fs='12px'
          maxWidth='300px'
          h='20px'
          color='#333'
          value={value}
          inputProps={inputProps}
          onKeyup={decodeValue(setArgument)} />
  }
})

/**
 * <ColorSelect/>
 */

const ColorSelect = component({
  render ({props}) {
    const {value, values, setArgument} = props

    return (
      <Dropdown
        zIndex='999'
        btn={<Block w={60} h={20} bgColor={value} />}>
        <Grid itemsPerRow='4' rowAlign='center center' columnAlign='start center'>
          {
            values.map(color => (
              <MenuItem onClick={setArgument(color.name)}>
                <Block sq={20} bgColor={color.value} />
              </MenuItem>
            ))
          }
        </Grid>
      </Dropdown>
    )
  }
})

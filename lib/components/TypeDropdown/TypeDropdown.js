/**
 * Imports
 */

import { Dropdown, MenuItem, Input } from 'vdux-containers'
import { component, element } from 'vdux'

/**
 * <Type Dropdown/>
 */

export default component({
  render ({ props }) {
    const { clickHandler, value = 'write', btn, name } = props
    const options = [
      {
        value: 'write',
        display: 'Write Code'
      },
      {
        value: 'read',
        display: 'Read Code'
      },
      {
        value: 'debug',
        display: 'Debug Code'
      },
      {
        value: 'project',
        display: 'Project'
      }
    ]

    return (
      <Dropdown
        btn={btn(options.find(opt => opt.value === value).display)}
        zIndex='999'
        value={value}
        fs='xs'
        wide
        textTransform='capitalize'>
        <Input hide name={name} value={value} />
        {options.map(({ value, display }) => (
          <MenuItem onClick={clickHandler(value)}>{display}</MenuItem>
        ))}
      </Dropdown>
    )
  }
})

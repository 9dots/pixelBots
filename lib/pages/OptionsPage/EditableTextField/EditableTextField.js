/**
 * Imports
 */

import EditModal from 'components/EditModal'
import {component, element} from 'vdux'
import MenuItem from '../MenuItem'
import {Block} from 'vdux-ui'

/**
 * <Editable Text Field/>
 */

export default component({
  render ({props, context}) {
	  const {label, field, value, onSubmit, validate, textarea, disabled, ...restProps} = props

	  return (
	    <MenuItem
	    	align='stretch center'
        color={disabled ? 'disabled' : 'black'}
	    	onClick={!disabled && context.openModal(() => <EditModal
	        field={field}
	        validate={validate}
	        textarea={textarea}
	        value={value}
	        onSubmit={onSubmit}
	        dismiss={context.closeModal}
	        label={label}/>
	      )}
	    	label={label}
	    	value={<Block maxHeight='66px' overflow='hidden'>{value}</Block>}
	    	{...restProps}>
	    </MenuItem>
	  )
  }
})

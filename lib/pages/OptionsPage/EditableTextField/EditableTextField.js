/**
 * Imports
 */

import EditModal from 'components/EditModal'
import {component, element} from 'vdux'
import MenuItem from '../MenuItem'

/**
 * <Editable Text Field/>
 */

export default component({
  render ({props, context}) {
	  const {label, field, value, onSubmit, validate, textarea, ...restProps} = props

	  return (
	    <MenuItem
	    	align='center center'
	    	onClick={context.openModal(() => <EditModal
	        field={field}
	        validate={validate}
	        textarea={textarea}
	        value={value}
	        onSubmit={onSubmit}
	        dismiss={context.closeModal}
	        label={label}/>
	      )}
	    	label={label}
	    	value={value}
	    	{...restProps}>
	    </MenuItem>
	  )
  }
})

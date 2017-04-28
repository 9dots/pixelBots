/**
 * Imports
 */

import EditLevelModal from '../EditLevelModal'
import {component, element} from 'vdux'
import MenuItem from '../MenuItem'

/**
 * <Editable Level Item/>
 */

export default component({
  render ({props, context, state, actions}) {
	  const {
	    label,
	    title,
	    field,
	    value,
	    game,
	    colorPicker,
	    onSubmit,
	    painted,
	    validate,
	    clickHandler,
	    ...restProps
	  } = props

	  return (
	    <MenuItem
	    	align='center center'
	    	onClick={actions.showModal}
	    	label={label}
	    	value={value}
	    	{...restProps}>
				{state.modal && <EditLevelModal
		      field={field}
		      validate={validate}
		      value={value}
		      onSubmit={onSubmit}
		      clickHandler={clickHandler}
		      colorPicker={colorPicker}
		      painted={painted}
		      game={game}
		      dismiss={actions.hideModal}
		      title={title}
		      label={label}/>}
	    </MenuItem>
	  )
  },
  reducer: {
  	showModal: () => ({modal: true}),
  	hideModal: () => ({modal: false})
  }
})

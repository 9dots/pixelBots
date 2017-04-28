/**
 * Imports
 */

import {component, element, stopPropagation} from 'vdux'
import ModalMessage from 'components/ModalMessage'
import Button from 'components/Button'
import {Toggle} from 'vdux-toggle'
import MenuItem from '../MenuItem'
import {Block} from 'vdux-ui'

/**
 * <Permissions Field/>
 */

export default component({
  render ({props, context, actions}) {
	  const {label, fields, onSubmit, checked = [], handleClick, ...restProps} = props

	  const footer = (
	    <Block absolute top='1em' right='1em'>
	      <Button ml='1em' bgColor='blue' onClick={[stopPropagation, context.closeModal, onSubmit]}>X</Button>
	    </Block>
	  )

	  const body = <Block w='285px' minWidth='285px' margin='0 auto'>
	    {fields.map((field) => <Toggle
	      my='8px'
	      fs='l'
	      bgColor='green'
	      value={field}
	      name={field}
	      label={field}
	      labelPosition='right'
	      labelProps={{ml: '2em', flex: true}}
	      startActive={checked.indexOf(field) > -1}
	      onClick={actions.onClick(field)}
	      type='checkbox' />)}
	  </Block>

	  return (
	    <MenuItem
	    	align='center center'
	    	onClick={context.openModal(() => <ModalMessage
		        w='100%'
		        h='100%'
		        m='0'
		        top='0'
		        pt='5%'
		        headerColor='#666'
		        bgColor='#FAFAFA'
		        header={label}
		        noFooter
		        dismiss={context.closeModal}
		        body={body}>
		        {footer}
	      	</ModalMessage>
	      )}
	    	label={label}
	    	value={checked.join(', ')}
	    	{...restProps}>
	    </MenuItem>
	  )
  },
  controller: {
  	* onClick ({props}, field) {
  		yield props.handleClick(field)
  	}
  }
})

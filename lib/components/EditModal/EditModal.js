/**
 * Imports
 */

import {component, element, stopPropagation, decodeValue, decodeRaw} from 'vdux'
import ModalMessage from 'components/ModalMessage'
import {Input, Textarea} from 'vdux-containers'
import Button from 'components/Button'
import {Block} from 'vdux-ui'
import Form from 'vdux-form'

/**
 * <Edit Modal/>
 */

export default component({
	initialState ({props}) {
		return {
			textValue: props.value || ''
		}
	},
  render ({props, actions, state}) {
	  const {field, label, onSubmit, dismiss, validate, textarea, ...restProps} = props
	  const {textValue} = state

	  const footer = (
	    <Block>
	      <Button
	      	bgColor='primary'
	      	onClick={[stopPropagation, dismiss]}>Cancel</Button>
	      <Button
	      	type='submit'
	      	form='submit-form'
	      	ml='1em'
	      	bgColor='blue'
	      	onClick={stopPropagation}>Save</Button>
	    </Block>
	  )

	  const body = <Block margin='0 auto' align='center'>
	    <Form wide id='submit-form' onSubmit={actions.submit()} validate={validate}>
	      {
	      	textarea 
	      		? <MyTextArea
	      				field={field}
	      				textValue={textValue}
	      				setTextValue={actions.setTextValue}/>
	      		: <EditInput
	      				field={field}
	      				textValue={textValue}
	      				setTextValue={actions.setTextValue}/>
	      }
	    </Form>
	  </Block>

	  return (
	    <ModalMessage
	      fullscreen={textarea}
	      dismiss={dismiss}
	      header={`Edit ${label}`}
	      noFooter={textarea}
	      headerColor='#666'
	      bgColor='#FAFAFA'
	      body={body}
	      onSubmit={actions.submit()}
	      footer={footer}
	      {...restProps} />
	  )
  },
  controller: {
  	* submit ({props, state}) {
  		const {field, onSubmit, dismiss} = props
  		const {textValue} = state
	    yield onSubmit({[field]: textValue})
	    yield dismiss()
	  }
  },
  reducer: {
  	setTextValue: (state, textValue) => ({textValue})
  }
})

const MyTextArea = component({
	render ({props}) {
		const {field, textValue, setTextValue} = props
		return (
			<Textarea
	      p='7px'
	      autofocus
	      w='60%'
	      margin='0 auto'
	      border='1px solid #ccc'
	      borderWidth='0'
	      borderBottomWidth='1px'
	      lineHeight='1.4'
	      bgColor='transparent'
	      resize='none'
	      focusProps={{borderColor: 'blue', borderBottomWidth: '2px'}}
	      name={field}
	      fs='18px'
	      value={textValue}
	      onKeyDown={decodeRaw(handleTab)}
	      onKeyUp={decodeValue(setTextValue)} />
     )
  }
})

const EditInput = component({
	render ({props}) {
		const {field, textValue, setTextValue} = props
		return <Input
      autofocus
      inputProps={{p: '12px', borderWidth: '2px', border: '#ccc'}}
      name={field}
      fs='18px'
      value={textValue}
      onKeyUp={decodeValue(setTextValue)} />
	}
})

function handleTab (evt) {
  if (evt.keyCode === 9) {
    evt.preventDefault()
    evt.stopPropagation()
    const target = evt.target
    var v = target.value
    var s = target.selectionStart
    var e = target.selectionEnd
    target.value = v.substring(0, s) + '\t' + v.substring(e)
    target.selectionStart = target.selectionEnd = s + 1
    return false
  }
}

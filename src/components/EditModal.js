/** @jsx element */

import handleActions from '@f/handle-actions'
import createAction from '@f/create-action'
import ModalMessage from './ModalMessage'
import {Input, Textarea} from 'vdux-containers'
import element from 'vdux/element'
import {Block} from 'vdux-ui'
import Button from './Button'
import Form from 'vdux-form'

const setTextValue = createAction('<EditModal/>: SET_TEXT')

const initialState = ({props}) => ({
  textValue: props.value || ''
})

function render ({props, state, local}) {
  const {field, label, onSubmit, dismiss, validate, textarea, ...restProps} = props
  const {textValue} = state

  function * submit () {
    yield onSubmit({[field]: textValue})
    yield dismiss()
  }

  const footer = (
    <Block>
      <Button bgColor='primary' onClick={[(e) => e.stopPropagation(), dismiss]}>Cancel</Button>
      <Button type='submit' form='submit-form' ml='1em' bgColor='blue' onClick={(e) => e.stopPropagation()}>Save</Button>
    </Block>
  )

  const body = <Block margin='0 auto' align='center'>
    <Form wide id='submit-form' onSubmit={submit} validate={validate}>
      {textarea ? getTextArea() : getInput()}
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
      onSubmit={submit}
      footer={footer}
      {...restProps} />
  )

  function getTextArea () {
    return <Textarea
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
      onKeyDown={handleTab}
      onKeyUp={local((e) => setTextValue(e.target.value))} />
  }

  function getInput () {
    return <Input
      autofocus
      inputProps={{p: '12px', borderWidth: '2px', border: '#ccc'}}
      name={field}
      fs='18px'
      value={textValue}
      onKeyUp={local((e) => setTextValue(e.target.value))} />
  }
}

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

const reducer = handleActions({
  [setTextValue.type]: (state, payload) => ({...state, textValue: payload})
})

export default {
  initialState,
  reducer,
  render
}

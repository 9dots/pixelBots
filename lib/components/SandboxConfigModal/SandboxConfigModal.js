/**
 * Imports
 */

import { Input, Textarea, Text } from 'vdux-containers'
import { Block, Modal, ModalFooter } from 'vdux-ui'
import Button from 'components/Button'
import validator from 'schema/level'
import Form from 'vdux-form'
import {
  component,
  element,
  stopPropagation,
  decodeValue,
  decodeRaw
} from 'vdux'

/**
 * <SandboxConfigModal/>
 */

export default component({
  initialState ({ props }) {
    return {
      titleText: props.title || '',
      descriptionText: props.description || ''
    }
  },
  render ({ props, state, actions, context }) {
    const { closeModal } = context
    return (
      <Modal my='l' h='auto' w='500px'>
        <Block margin='auto' align='left' p='l'>
          <Form
            wide
            id='submit-form'
            onSubmit={actions.submit}
            validate={({ title, description }) =>
              validator.title({ title }) &&
              validator.description({ description })
            }>
            Title
            <EditInput
              field={'title'}
              name={'title'}
              textValue={state.titleText}
              setTextValue={actions.setTitleText} />
            Description
            <MyTextArea
              field={'description'}
              name={'description'}
              textValue={state.descriptionText}
              setTextValue={actions.setDescriptionText} />
          </Form>
        </Block>
        <ModalFooter bgColor='#666' p='12px' fs='xxs'>
          <Text
            pointer
            mr
            color='grey'
            hoverProps={{ textDecoration: 'underline' }}
            onClick={context.closeModal}>
            CANCEL
          </Text>
          <Button
            type='submit'
            form='submit-form'
            ml={10}
            bgColor='blue'
            fs='s'
            onClick={[
              props.reset(),
              actions.submit,
              stopPropagation,
              closeModal
            ]}>
            Save
          </Button>
        </ModalFooter>
      </Modal>
    )
  },

  controller: {
    * submit ({ props, state, context }) {
      const { sandboxRef } = props
      const { titleText, descriptionText } = state
      yield context.firebaseUpdate(`/sandbox/${sandboxRef}`, {
        title: titleText,
        description: descriptionText
      })
    }
  },

  reducer: {
    setTitleText: (state, titleText) => ({ titleText }),
    setDescriptionText: (state, descriptionText) => ({ descriptionText })
  }
})

const MyTextArea = component({
  render ({ props }) {
    const { field, textValue, setTextValue } = props
    return (
      <Textarea
        p='7px'
        autofocus
        w='100%'
        mt='m'
        border='1px solid #ccc'
        borderWidth='0'
        borderBottomWidth='1px'
        lineHeight='1.4'
        bgColor='transparent'
        resize='none'
        focusProps={{ borderColor: 'blue', borderBottomWidth: '2px' }}
        name={field}
        fs='18px'
        value={textValue}
        onKeyDown={decodeRaw(handleTab)}
        onKeyUp={decodeValue(setTextValue)} />
    )
  }
})

const EditInput = component({
  render ({ props }) {
    const { field, textValue, setTextValue } = props
    return (
      <Input
        name={field}
        autofocus
        autocomplete='off'
        inputProps={{ p: '12px' }}
        fs='18px'
        mt='m'
        mb='l'
        maxWidth={500}
        mx='auto'
        value={textValue}
        onKeyUp={decodeValue(setTextValue)} />
    )
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

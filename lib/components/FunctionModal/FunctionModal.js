/**
 * Imports
 */

import { ModalHeader, ModalFooter, ModalBody, Modal, Block } from 'vdux-ui'
import { lettersCheck, spacesCheck } from 'schema/userFn'
import { component, element, decodeValue } from 'vdux'
import { Button, Input } from 'vdux-containers'
import Form from 'vdux-form'

/**
 * <Function Modal/>
 */

export default component({
  initialState ({ props }) {
    const { payload = [] } = props.block
    return { textValue: payload[0] }
  },
  render ({ props, context, state, actions }) {
    const { textValue = '' } = state
    const { closeModal } = context
    const { docs } = props
    const maxlength = 15

    const blackListed = Object.keys(docs || {})

    return (
      <Form
        id='user-fn-form'
        validate={validate(blackListed)}
        onSubmit={actions.submit}>
        <Modal onDismiss={closeModal}>
          <ModalHeader>Name Your Function</ModalHeader>
          <ModalBody w={420} mx='auto'>
            <Input
              autofocus
              autocomplete='off'
              inputProps={{
                p: '12px',
                textAlign: 'center',
                fontFamily: 'monospace',
                color: 'text'
              }}
              fs='18px'
              id='user-fn'
              name='userFn'
              field='userFn'
              mb
              wide
              maxlength={maxlength}
              value={textValue}
              onKeyUp={decodeValue(actions.setTextValue)} />
            <Block textAlign='right' fs='xs' mb='l'>
              {`${textValue.length} / ${maxlength}`}
            </Block>
          </ModalBody>
          <ModalFooter bgColor='#666' p='12px'>
            <Button fs='s' px='l' py='s' bgColor='blue' type='submit'>
              OK
            </Button>
          </ModalFooter>
        </Modal>
      </Form>
    )
  },
  reducer: {
    setTextValue: (state, textValue) => ({ textValue })
  },
  controller: {
    * submit ({ props, state, context }) {
      const { block, onSubmit } = props

      // if (fn) yield fn(block)
      yield context.closeModal
      yield onSubmit({
        ...block,
        payload: [state.textValue, ...(block.payload || []).slice(1)]
      })
    }
  }
})

const validate = blackListed => model => {
  if (blackListed.indexOf(model.userFn) > -1) {
    return {
      valid: false,
      errors: [{ field: 'userFn', message: 'Already in use.' }]
    }
  }
  return [lettersCheck, spacesCheck].reduce(
    (acc, validator) => {
      const res = validator(model)
      return {
        ...acc,
        valid: !res.valid ? res.valid : acc.valid,
        errors: res.errors ? acc.errors.concat(res.errors) : acc.errors
      }
    },
    { valid: true, errors: [] }
  )
}

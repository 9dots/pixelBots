/**
 * Imports
 */

import { Button, Input, Dropdown, MenuItem } from 'vdux-containers'
import { lettersCheck, spacesCheck } from 'schema/userFn'
import { component, element, decodeValue } from 'vdux'
import reduce from '@f/reduce'
import Form from 'vdux-form'
import { ModalHeader, ModalFooter, ModalBody, Modal, Block } from 'vdux-ui'

/**
 * <Function Modal/>
 */

export default component({
  initialState ({ props }) {
    const { payload = [] } = props.block
    return { textValue: payload[0] }
  },
  render ({ props, context, state, actions }) {
    const { onSubmit, block, fn = () => {} } = props
    const { closeModal } = context
    const { textValue = '' } = state
    const maxlength = 15

    return (
      <Form id='user-fn-form' validate={validate} onSubmit={actions.submit}>
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
      const { block, onSubmit, fn } = props

      if (fn) yield fn(block)
      yield context.closeModal
      yield onSubmit(block, state.textValue)
    }
  }
})

function validate (model) {
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

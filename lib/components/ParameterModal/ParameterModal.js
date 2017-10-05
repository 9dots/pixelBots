/**
 * Imports
 */

import { Button, Input, Dropdown, MenuItem } from 'vdux-containers'
import { lettersCheck, spacesCheck } from 'schema/userFn'
import { component, element, decodeValue } from 'vdux'
import DropdownButton from 'components/DropdownButton'
import Form from 'vdux-form'
import {
  Text,
  Modal,
  Menu,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Block
} from 'vdux-ui'

/**
 * <Function Modal/>
 */

export default component({
  initialState ({ props }) {
    return { textValue: props.block.payload, type: 'color' }
  },
  render ({ props, context, state, actions }) {
    const { textValue = '', type } = state
    const { closeModal } = context
    const maxlength = 15

    return (
      <Form id='parameter-form' onSubmit={actions.submit}>
        <Modal onDismiss={closeModal}>
          <ModalHeader>Create Your Parameter</ModalHeader>
          <ModalBody w={420} mx='auto'>
            <Block align='start center' mb>
              <Text w='50' display='block' mr>
                Type:
              </Text>
              <Block zIndex='999' flex>
                <Dropdown btn={<DropdownButton wide text={type} />}>
                  <Menu column wide>
                    <MenuItem onClick={actions.setType('number')}>
                      Number
                    </MenuItem>
                    <MenuItem onClick={actions.setType('color')}>
                      Color
                    </MenuItem>
                  </Menu>
                </Dropdown>
              </Block>
            </Block>
            <Block align='start center'>
              <Text w='50' display='block' mr>
                Name:
              </Text>
              <Input
                autofocus
                autocomplete='off'
                inputProps={{
                  p: '12px',
                  fontFamily: 'monospace',
                  color: 'text'
                }}
                fs='18px'
                id='name'
                name='name'
                field='name'
                flex
                maxlength={maxlength}
                value={textValue}
                onKeyUp={decodeValue(actions.setTextValue)} />
            </Block>
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
    setTextValue: (state, textValue) => ({ textValue }),
    setType: (state, type) => ({ type })
  },
  controller: {
    * submit ({ props, state, context }) {
      const { block, onSubmit, fn } = props
      const { type, textValue } = state
      if (fn) yield fn(block)
      yield context.closeModal
      yield onSubmit(block, { type, name: textValue })
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

/**
 * Imports
 */

import { Button, Input, Dropdown, MenuItem } from 'vdux-containers'
import { lettersCheck, spacesCheck, typeCheck } from 'schema/userFn'
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
    const { name = '', type } = props.arg || {}
    return { textValue: name, type }
  },
  render ({ props, context, state, actions }) {
    const { textValue = '', type } = state
    const { closeModal } = context
    const { block } = props
    const maxlength = 10
    const typeDisplay = {
      number: 'Number',
      string: 'Color'
    }

    return (
      <Form
        id='parameter-form'
        validate={validate(block)}
        onSubmit={actions.submit}>
        <Modal onDismiss={closeModal}>
          <ModalHeader>Create Your Parameter</ModalHeader>
          <ModalBody w={420} mx='auto'>
            <Block align='start center' mb>
              <Text w='50' display='block' mr>
                Type:
              </Text>
              <Block zIndex='999' flex>
                <Input display='none' hidden name='type' value={type} />
                <Dropdown
                  wide
                  btn={
                    <DropdownButton
                      wide
                      text={typeDisplay[type] || 'Select a type'} />
                  }>
                  <Menu column wide>
                    <MenuItem onClick={actions.setType('number')}>
                      Number
                    </MenuItem>
                    <MenuItem onClick={actions.setType('string')}>
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
                name='userFn'
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
            {props.arg && (
              <Button
                opacity={0.6}
                hoverProps={{ opacity: 1 }}
                fs='m'
                onClick={actions.delete}
                icon='delete'
                mr />
            )}
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
    * delete ({ props, state, context }) {
      const { block, remove, arg } = props
      yield context.closeModal
      yield remove(block, arg)
    },
    * submit ({ props, state, context }) {
      const { block, onSubmit, arg } = props
      const { type, textValue } = state
      yield context.closeModal
      yield onSubmit(block, {
        type,
        name: textValue,
        id: arg ? arg.id : Date.now()
      })
    }
  }
})

function validate (block) {
  const parameters = block.payload.map(arg => arg.name)
  // console.log(parameters)
  return function (model) {
    if (parameters.indexOf(model.userFn) > -1) {
      return {
        valid: false,
        errors: [{ field: 'userFn', message: 'Already in use.' }]
      }
    }
    return [lettersCheck, spacesCheck, typeCheck].reduce(
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
}

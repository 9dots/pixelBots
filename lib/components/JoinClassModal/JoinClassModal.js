/**
 * Imports
 */

import {component, element, decodeValue} from 'vdux'
import ModalMessage from 'components/ModalMessage'
import {Block, Input} from 'vdux-containers'
import Button from 'components/Button'
import validator from 'schema/link'
import Form from 'vdux-form'
import sleep from '@f/sleep'

/**
 * <CodeLink/>
 */

export default component({
  initialState: {
    textVal: ''
  },

  render ({props, state, actions, context}) {
    const {textVal} = state

    const footer = (
      <Block>
        <Button bgColor='secondary' onClick={context.closeModal()}>Cancel</Button>
        <Button ml='m' form='code-link-form' bgColor='blue' type='submit'>Join</Button>
      </Block>
    )

    const body = (
      <Block>
        <Form id='code-link-form' validate={validator} onSubmit={actions.handleSubmit()} mb='l'>
          <Input
            autofocus
            autocomplete='off'
            placeholder='Enter code here…'
            inputProps={{p: '12px', borderWidth: '1px', border: '#ccc'}}
            id='url-input'
            name='link'
            fs='18px'
            onKeyUp={decodeValue(actions.setText)}
            value={textVal} />
        </Form>
      </Block>
    )

    return (
      <ModalMessage
        header='Code Link'
        body={body}
        footer={footer}/>
    )
  },

  controller: {
    * handleSubmit ({context, actions,state}) {
      const {textVal} = state
      const code = textVal.toUpperCase()
      const snap = yield context.firebaseOnce('/class_codes/' + code)
      const classId = snap.val()
      yield context.closeModal()
      if (classId) {
        const getter = yield context.firebaseOnce(`/classes/${classId}/displayName`)
        const className = getter.val()
        yield context.firebaseSet(`/classes/${classId}/students/${context.uid}`, true)
        yield context.firebaseSet(`/users/${context.uid}/studentOf/${classId}`, true)
        yield context.openModal(() => <ModalMessage header='Success!'
            //onSubmit={context.setUrl(`/`)}
            body={"You have sucessfully joined " + className + "'s class."}/>)
        yield context.setUrl(`/`)
      }
      else {
        yield context.openModal({header: 'Try Again', body: "Your class code was invalid."})
      } 
    }
  },

  reducer: {
    setText: (state, textVal) => ({textVal})
  }
})

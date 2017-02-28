import ModalMessage from './ModalMessage'
import {Input} from 'vdux-containers'
import {Toggle} from 'vdux-toggle'
import element from 'vdux/element'
import {Block, Text} from 'vdux-ui'
import createAction from '@f/create-action'
import handleActions from '@f/handle-actions'

const url = window.location.host + '/'
const toggleDisplayCode = createAction('<LinkModal/>: TOGGLE_DISPLAY_CODE')

const initialState = ({local}) => ({
  displayCode: true,
  actions: {
    toggleDisplayCode: local(toggleDisplayCode)
  }
})

function render ({props, state}) {
  const {header = 'Save Code', code, footer, ...restProps} = props
  const {displayCode, actions} = state

  const body = <Block>
    <Input
      readonly
      inputProps={{p: '12px', borderWidth: '2px', border: '#ccc'}}
      id='url-input'
      fs='18px'
      onFocus={() => document.getElementById('url-input').children[0].select()}
      value={displayCode ? code : `http://${url}${code}`}>
      {`${url}${code}`}
    </Input>
    <Block mt='1em' mb='2px'>
      <Toggle onClick={() => actions.toggleDisplayCode()} bgColor='blue' label='Link:' w='100px' />
    </Block>
    <Block>
      <Text fs='xs'>
        <strong>Note:</strong>
        {
          displayCode
            ? " Use this code in the 'Code' section of the navigation bar."
            : ' Use the link in the url bar of your browser.'
        }
      </Text>
    </Block>
  </Block>

  return (
    <ModalMessage
      header={header}
      body={body}
      footer={footer}
      w='40%'
      {...restProps}
    />
  )
}

const reducer = handleActions({
  [toggleDisplayCode]: (state) => ({...state, displayCode: !state.displayCode})
})

export default {
  initialState,
  reducer,
  render
}

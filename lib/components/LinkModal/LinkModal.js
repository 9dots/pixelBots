/**
 * Imports
 */

import ModalMessage from 'components/ModalMessage'
import {component, element} from 'vdux'
import {Input} from 'vdux-containers'
import {Block, Text} from 'vdux-ui'
import {Toggle} from 'vdux-toggle'

/**
 * <Link Modal/>
 */
const url = window.location.host + '/'

export default component({
	initialState: {
		displayCode: true
	},
  render ({props, state, actions}) {
		const {header = 'Save Code', code, footer, ...restProps} = props
	  const {displayCode} = state

	  const body = <Block>
	    <Input
	      readonly
	      inputProps={{p: '12px', borderWidth: '2px', border: '#ccc'}}
	      id='url-input'
	      fs='18px'
	      onFocus={actions.handleFocus()}
	      value={displayCode ? code : `http://${url}${code}`}>
	      {`${url}${code}`}
	    </Input>
	    <Block mt='1em' mb='2px'>
	      <Toggle onClick={actions.toggleDisplayCode} bgColor='blue' label='Link:' w='100px' />
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
  },
  controller: {
  	* handleFocus () {
  		yield document.getElementById('url-input').children[0].select()
  	}
  },
  reducer: {
  	toggleDisplayCode: (state) => ({displayCode: !state.displayCode})
  }
})

/**
 * Imports
 */

import ModalMessage from 'components/ModalMessage'
import {component, element} from 'vdux'
import {Input, Toggle} from 'vdux-containers'
import {Block} from 'vdux-ui'

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
	      autofocus
	      inputProps={{p: '12px', border: '1px solid divider'}}
	      id='url-input'
	      fs='18px'
	      onFocus={actions.handleFocus()}
	      value={displayCode ? code : `http://${url}${code}`}>
	      {`${url}${code}`}
	    </Input>
	    <Block mt='1em' mb='2px' align='start center'>
	    	<Block mr>Link: </Block>
	      <Toggle onChange={actions.toggleDisplayCode} checked={!displayCode} />
	    </Block>
      <Block fs='xs' bolder italic py color='#666'>
      	{
          displayCode
            ? 'Enter this code in the "Code" section of the sidebar.'
            : 'Use the link in the url bar of your browser.'
        }
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

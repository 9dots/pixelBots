/**
 * Imports
 */

import AddToPlaylistModal from 'components/AddToPlaylistModal'
import {component, element} from 'vdux'
import Button from 'components/Button'
import {Block} from 'vdux-ui'

/**
 * <Publish Page/>
 */

export default component({
  render ({props, context, actions}) {
  	const {uid, username} = context
  	const {draftID, publish} = props
	  return (
	    <Block w='50%' m='0 auto' tall align='center center'>
	      <Btn mr onClick={context.setUrl(`/${username}/authored/drafts`)}
	        >Save Draft</Btn>
	      <Btn
	        onClick={context.openModal(() => <AddToPlaylistModal
            onSubmit={publish(draftID)}
            cancel='Skip'
            gameID={draftID}
            uid={uid} />
	        )}>
	        	Publish
        	</Btn>
	    </Block>
	  )
  }
})

const Btn = component({
	render({props, children}) {
		return (
			<Button 
        hoverProps={{color: 'blue', borderColor: 'blue'}}
        borderColor='#CCC'
        fontWeight='200'
				bgColor='#FFF'
        color='primary'
        fs='m'
        py
        px='xl'
        {...props}>
					{children}
			</Button>
		)
	}
})

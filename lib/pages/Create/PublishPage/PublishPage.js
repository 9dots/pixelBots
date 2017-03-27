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
	    <Block w='50%' m='0 auto' tall align='space-around center'>
	      <Button
	        bgColor='#FFF'
	        hoverProps={{color: 'blue', borderColor: 'blue'}}
	        color='#666'
	        fs='xl'
	        px='l'
	        py='m'
	        w='300px'
	        borderColor='#CCC'
	        onClick={context.openModal(() => <AddToPlaylistModal
            onSubmit={publish(draftID)}
            onCancel={publish(draftID)}
            cancel='Skip'
            gameID={draftID}
            uid={uid} />
	        )}
	        fontWeight='200'>Publish</Button>
	      <Button
	        bgColor='#FFF'
	        hoverProps={{color: 'blue', borderColor: 'blue'}}
	        color='#666'
	        fs='xl'
	        px='l'
	        py='m'
	        w='300px'
	        borderColor='#CCC'
	        onClick={context.setUrl(`/${username}/authored/drafts`)}
	        fontWeight='200'>Save Draft</Button>
	    </Block>
	  )
  }
})

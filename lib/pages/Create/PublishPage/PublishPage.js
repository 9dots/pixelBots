/**
 * Imports
 */

import AddToPlaylistModal from 'components/AddToPlaylistModal'
import {component, element} from 'vdux'
import Button from 'components/Button'
import {Block, Text} from 'vdux-ui'

/**
 * <Publish Page/>
 */

export default component({
  render ({props, context, actions}) {
  	const {uid, username} = context
  	const {draftID, publish, data} = props
  	const {title, description, animals, permissions, inputType} = data

	  return (
	    <Block w={450} m='-60px auto 0' tall column align='center center'>
	    	<Block mb='xl' wide>
	    		<Block fs='xl' ellipsis bold color='blue'>{title}</Block>
	    		<Block ellipsis mt='s'>{description}</Block>
	    		<Block mt='l' textTransform='capitalize'>
	    			<Block align='start center' mt='s'>
	    				<Text bold w={120}>Animal:</Text> {animals[0].type}
    				</Block>
    				<Block align='start center' mt='s'>
	    				<Text bold w={120}>Controls:</Text> {inputType}
	    			</Block>
	    			<Block align='start center' mt='s'>
	    				<Text bold w={120}>Permissions:</Text>
		    			{
		    				permissions.map((perm, i) => <Text>
		    					{i ? ', ' : ''}{perm}</Text>)
		    			}
	    			</Block>
					</Block>
    		</Block>
    		<Block>
	      <Btn mr onClick={context.setUrl(`/${username}/authored/drafts`)} bgColor='#AAA'
	        >Save Draft</Btn>
	      <Btn
	        onClick={context.openModal(() => <AddToPlaylistModal
            onSubmit={publish(draftID)}
            onCancel={publish(draftID)}
            cancel='Skip'
            gameID={draftID}
            uid={uid} />
	        )}>
	        	Publish
        	</Btn>
      	</Block>
	    </Block>
	  )
  }
})

const Btn = component({
	render({props, children}) {
		return (
			<Button 
				bgColor='green'
        px='xl'
        fs='m'
        py
        {...props}>
					{children}
			</Button>
		)
	}
})

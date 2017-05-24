/**
 * Imports
 */

import AddToPlaylistModal from 'components/AddToPlaylistModal'
import {component, element} from 'vdux'
import Button from 'components/Button'
import {Block, Text} from 'vdux-ui'
import mapVals from '@f/map-values'
import filter from '@f/filter'

/**
 * <Publish Page/>
 */

export default component({
  render ({props, context, actions}) {
  	const {uid, username} = context
  	const {draftID, publish, data} = props
  	const {title, description, permissions, inputType, type} = data
  	const capabilities = filter((val, key) => key !== 'block_end'
  		, data.capabilities)
  	const labelWidth = 150

	  return (
	    <Block w={450} m='-60px auto 0' tall column align='center center'>
	    	<Block mb='xl' wide>
	    		<Block fs='xl' ellipsis bold color='blue'>{title}</Block>
	    		<Block ellipsis mt='s'>{description}</Block>
	    		<Block mt='l' textTransform='capitalize'>
	    			<Block align='start'>
	    				<Text bold w={labelWidth}>Challenge Mode:</Text>
		    			<Text>{type}</Text>
	    			</Block>
    				<Block align='start' my>
	    				<Text bold w={labelWidth}>Code Type:</Text> {inputType}
	    			</Block>
	    			<Block align='start'>
	    				<Text bold w={labelWidth}>Capabilities:</Text> 
	    				<Block textTransform='none' flex fontFamily='monospace'>
	    					{ mapVals((val, key) => key, capabilities).join(', ') }
	    				</Block>
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

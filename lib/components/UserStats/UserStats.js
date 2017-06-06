/**
 * Imports
 */

import {component, element} from 'vdux'
import {Block, Image, Icon} from 'vdux-ui'

/**
 * <User Stats/>
 */

export default component({
  render ({props}) {
    return (
    	<Block>
    		<Block bgColor='white' border='1px solid divider' p='l' align='space-around center'>
    			<Block column align='center center' color='blue'>
    				<Block mb fs={50} fontFamily='"Press Start 2P"'>10</Block>
    				<Block>Total Challenges</Block>
    			</Block>
    			<Block column align='center center' color='red'>
    				<Block mb fs={50} fontFamily='"Press Start 2P"'>10</Block>
    				<Block>Total Challenges</Block>
    			</Block>
    			<Block column align='center center' color='green'>
    				<Block mb fs={50} fontFamily='"Press Start 2P"'>10</Block>
    				<Block>Total Challenges</Block>
    			</Block>
    		</Block>
    		<Block my='l' bgColor='white' border='1px solid divider' p='l' align='space-around center'>
    			<Badge color='blue' label='Badge 1' badge='accessibility' />
    			<Badge color='red' label='You done it' badge='android' />
    			<Badge color='green' label='Great Job!' badge='face' />
    			<Badge color='yellow' label='Awesome' badge='accessibility' />
    		</Block>
    		<Block align='start center'>
		    	<Block bgColor='white' border='1px solid divider' p mr flex>
		    		<Row label='Playlists Completed'>5</Row>
		    		<Row label='Reading Challenges'>10</Row>
		    		<Row label='Writing Challenges'>15</Row>
		    		<Row label='Advanced Challenges'>5</Row>
		    		<Row label='Lines of Code'>5</Row>
		    		<Row label='Number of Steps'>5</Row>
		    		<Row label='Challenges Created'>5</Row>
		    	</Block>
		    	<Block bgColor='white' border='1px solid divider' p ml flex>
		    		<Row label='Playlists Completed'>5</Row>
		    		<Row label='Reading Challenges'>10</Row>
		    		<Row label='Writing Challenges'>15</Row>
		    		<Row label='Advanced Challenges'>5</Row>
		    		<Row label='Lines of Code'>5</Row>
		    		<Row label='Number of Steps'>5</Row>
		    		<Row label='Challenges Created'>5</Row>
		    	</Block>
	    	</Block>
    	</Block>
    )
  }
})

const Row = component({
	render ({props, children}) {
		const {label, ...rest} = props
		return (
			<Block my align='start center' {...rest}>
				<Block w={220} pr='l' textAlign='right'>{label}:</Block>
				<Block fontFamily='"Press Start 2P"' fs={14}>{children}</Block>
			</Block>
		)
	}
})


const Badge = component({
	render ({props}) {
		const {label, badge, color, ...rest} = props
		return (
			<Block column align='start center' {...rest}>
				<Block bgColor={color} circle={100} mx mb align='center center' border='6px solid rgba(0,0,0,.2)'>
					<Icon name={badge} color='white' opacity={.5} fs={60} />
				</Block>
				<Block fontFamily='"Press Start 2P"' fs={14}>{label}</Block>
			</Block>
		)
	}
})
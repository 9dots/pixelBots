/**
 * Imports
 */

import {component, element} from 'vdux'
import {Block, Image, Icon} from 'vdux-ui'
import Badge from 'components/Badge'

/**
 * <User Stats/>
 */

export default component({
  render ({props}) {
    return (
    	<Block w='720px' mx='auto'>
    		<Block mb='l' bgColor='white' border='1px solid divider'>
    			<Block bg='#835584' p textAlign='center' color='white' fontFamily='"Press Start 2P"'>Badges</Block>
    			<Block align='space-around center' p='l'>
	    			<Badge color='yellow' name='Completed' count={10} icon='star' />
	    			<Badge color='blue' name='Line Limit' count={1} icon='list' />
	    			<Badge color='green' name='Step Limit' count={3} icon='show_chart' />
    			</Block>
    		</Block>
	    	<Block bgColor='white' border='1px solid divider'flex>
  				<Block bg='#835584' p textAlign='center' color='white' fontFamily='"Press Start 2P"'>Stats</Block>
  				<Block p>
		    		<Row label='Playlists Completed'>5</Row>
		    		<Row label='Reading Challenges'>10</Row>
		    		<Row label='Writing Challenges'>15</Row>
		    		<Row label='Advanced Challenges'>5</Row>
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
			<Block py align='start center' fontFamily='"Press Start 2P"' fs={14} {...rest}>
				<Block w='60%' pr='l'>{label}:</Block>
				<Block>{children}</Block>
			</Block>
		)
	}
})
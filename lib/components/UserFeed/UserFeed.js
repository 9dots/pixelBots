/**
 * Imports
 */

import {component, element} from 'vdux'
import Card from 'components/Card'
import {Block} from 'vdux-ui'
import mapValues from '@f/map-values'

/**
 * <User Feed/>
 */

export default component({
  render ({props, context}) {
  	const {users} = props

    return (
    	<Block mt flexWrap='wrap' align='center'>
    		{ 
    			mapValues((user) => <UserCard user={user} />, users) 
    		}
    	</Block>
    )
  }
})

const UserCard = component({
	render({props, context}) {
		const {user} = props
		return (
			<Card 
				onClick={context.setUrl(`/${user.username}`)}
				pointer
				m='15px'
        w='192px'
        h='auto'>
  				{user.username}
				</Card>
		)
	}
})
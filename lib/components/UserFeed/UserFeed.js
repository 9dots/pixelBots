/**
 * Imports
 */

import {component, element} from 'vdux'
import Card from 'components/Card'
import {Block, Image} from 'vdux-ui'
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
	render ({props, context}) {
		const {user} = props
    const {username} = user
    console.log(user)

		return (
			<Card
				onClick={context.setUrl(`/${username}`)}
				pointer
				m='15px'
        w='192px'
        h='auto'>
          <Image />
				  {username}
			</Card>
		)
	}
})

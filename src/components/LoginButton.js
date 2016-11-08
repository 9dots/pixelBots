import {signInWithGoogle, signOut} from '../middleware/auth'
import {Button, Icon} from 'vdux-containers'
import element from 'vdux/element'
import {Block} from 'vdux-ui'

function render ({props}) {
	const {user} = props
	console.log(user)
	return (
		<Block>
			{user.isAnonymous
			  ? <Button onClick={signInWithGoogle}>Sign In w/ Google</Button>
			  : <Button onClick={signOut}><Icon name='exit_to_app'/></Button>
			}
		</Block>
	)
}

export default {
	render
}
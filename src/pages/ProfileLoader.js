import IndeterminateProgress from '../components/IndeterminateProgress'
import element from 'vdux/element'
import Profile from './Profile'
import fire from 'vdux-fire'

function render ({props}) {
	const {user, currentUser} = props
	if (user.loading) return <IndeterminateProgress/>
	if (user.value === null) return <div>User not Found</div>
	return (
		<Profile user={user.value} mine={user.value.uid === currentUser.uid}/>
	)
}

export default fire((props) => ({
  user: `/users/${props.username}`
}))({
	render
})
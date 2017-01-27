import IndeterminateProgress from '../components/IndeterminateProgress'
import {setUrl} from 'redux-effects-location'
import element from 'vdux/element'
import Profile from './Profile'
import fire from 'vdux-fire'

function * onCreate ({props}) {
	if (!props.params) {
		yield setUrl(`/${props.username}/challenges`, true)
	}
}

function * onUpdate (prev, {props}) {
	if (!props.params) {
		yield setUrl(`/${props.username}/challenges`, true)
	}
}

function render ({props}) {
	const {user, currentUser} = props
	if (user.loading || !currentUser || !props.params) return <IndeterminateProgress/>
	if (user.value === null) return <div>User not Found</div>
	return (
		<Profile username={props.username} currentUser={currentUser} params={props.params} userKey={user.value} mine={user.value === currentUser.uid}/>
	)
}

export default fire((props) => ({
  user: `/usernames/${props.username}`
}))({
	onCreate,
	onUpdate,
	render
})
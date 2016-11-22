import IndeterminateProgress from '../components/IndeterminateProgress'
import {setUrl} from 'redux-effects-location'
import element from 'vdux/element'
import Profile from './Profile'
import fire from 'vdux-fire'

function * onCreate ({props}) {
	if (!props.params) {
		yield setUrl(`/${props.username}/games`)
	}
}

function * onUpdate (prev, {props}) {
	if (!props.params) {
		yield setUrl(`/${props.username}/games`)
	}
}

function render ({props}) {
	const {user, currentUser} = props
	if (user.loading || !currentUser || !props.params) return <IndeterminateProgress/>
	if (user.value === null) return <div>User not Found</div>
	return (
		<Profile username={props.username} params={props.params} user={user.value} mine={user.value.uid === currentUser.uid}/>
	)
}

export default fire((props) => ({
  user: `/users/${props.username}`
}))({
	onCreate,
	onUpdate,
	render
})
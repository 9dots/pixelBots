import IndeterminateProgress from '../components/IndeterminateProgress'
import {setUrl} from 'redux-effects-location'
import element from 'vdux/element'
import Profile from './Profile'
import fire from 'vdux-fire'

function * onCreate ({props}) {
  if (!props.params) {
    props.mine
			? yield setUrl(`/${props.username}/studio`, true)
			: yield setUrl(`/${props.username}/gallery`, true)
  }
}

function * onUpdate (prev, {props}) {
  if (!props.params) {
    props.mine
			? yield setUrl(`/${props.username}/studio`, true)
			: yield setUrl(`/${props.username}/gallery`, true)
  }
}

function render ({props}) {
  const {user, uid} = props
  if (user.loading || !uid || !props.params) return <IndeterminateProgress />
  if (user.value === null) return <div>User not Found</div>
  return (
    <Profile
      category={props.category}
      username={props.username}
      uid={uid}
      params={props.params}
      userKey={user.value}
      mine={user.value === uid} />
  )
}

export default fire((props) => ({
  user: `/usernames/${props.username}`
}))({
  onCreate,
  onUpdate,
  render
})

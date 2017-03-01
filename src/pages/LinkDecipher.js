import IndeterminateProgress from '../components/IndeterminateProgress'
import PlaylistLoader from './PlaylistLoader'
import Redirect from '../components/Redirect'
import {setUrl} from 'redux-effects-location'
import ProfileLoader from './ProfileLoader'
import SharedProject from './SharedProject'
import MyPlaylist from './MyPlaylist'
import GameLoader from './GameLoader'
import element from 'vdux/element'
import enroute from 'enroute'
import fire from 'vdux-fire'

const router = enroute({
  'game': (params, props) => (
    <Redirect path={`/games/${props.payload}`} />
  ),
  'saved': (params, props) => (
    <GameLoader {...props} left='60px' saveLink={props.link} gameCode={props.payload.gameRef} saveID={props.payload.saveRef} />
  ),
  'playlists': (params, props) => (
    <MyPlaylist anonymous={props.payload.anonymous} current={props.payload.current} saveLink={props.link} ref={props.payload.ref} user={props.user} />
  ),
  'playlist': (params, props) => (
    <Redirect path={`/playlist/${props.payload}`} />
  ),
  'list': (params, props) => (
    <PlaylistLoader {...props} ref={props.payload} saveLink={props.link} user={props.user} />
  ),
  'shared': (params, props) => (
    <SharedProject {...props} saveRef={props.payload.saveRef} gameRef={props.payload.gameRef} />
  ),
  ':username': ({username}, props) => <ProfileLoader mine={props.user.username === username} uid={props.user} username={username} />,
  '*': () => <div>Bad Link</div>
})

function render ({props}) {
  const {linkSnap} = props

  if (linkSnap.loading) {
    return <IndeterminateProgress />
  }

  if (!linkSnap.value) {
    return (
      <div>
        {router(props.link, props)}
      </div>
    )
  }

  const {type, payload} = linkSnap.value
  return (
    router(type, {...props, payload})
  )
}

export default fire((props) => ({
  linkSnap: `/links/${props.link.toUpperCase()}`
}))({
  render
})

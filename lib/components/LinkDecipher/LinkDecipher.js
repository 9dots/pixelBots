/**
 * Imports
 */

// import PlaylistLoader from 'components/PlaylistLoader'
import SharedProject from 'pages/SharedProject'
// import GameLoader from 'components/GameLoader'
import Redirect from 'components/Redirect'
import Loading from 'components/Loading'
import {component, element} from 'vdux'
import enroute from 'enroute'
import fire from 'vdux-fire'

const router = enroute({
  'game': (params, props) => (
    <Redirect to={`/games/${props.payload}`} />
  ),
  // 'saved': (params, props) => (
  //   <GameLoader {...props} left='60px' saveLink={props.link} gameCode={props.payload.gameRef} saveID={props.payload.saveRef} />
  // ),
  // 'playlists': (params, props) => (
  //   <MyPlaylist anonymous={props.payload.anonymous} current={props.payload.current} saveLink={props.link} ref={props.payload.ref} user={props.user} />
  // ),
  'playlist': (params, props) => (
    <Redirect to={`/playlist/${props.payload}`} />
  ),
  // 'list': (params, props) => (
  //   <PlaylistLoader {...props} ref={props.payload} saveLink={props.link} user={props.user} />
  // ),
  'shared': (params, props) => (
    <SharedProject {...props} saveRef={props.payload.saveRef} gameRef={props.payload.gameRef} />
  ),
  ':profileName': ({profileName}, props) => <Redirect to={`/${profileName}/gallery`}/>,
  '*': () => <div>Bad Link</div>
})

/**
 * <Link Decipher/>
 */

export default fire((props) => ({
  linkSnap: `/links/${props.link.toUpperCase()}`
}))(component({
  render ({props}) {
	  const {linkSnap} = props

	  if (linkSnap.loading) {
	    return <Loading />
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
}))

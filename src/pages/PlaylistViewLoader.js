import IndeterminateProgress from '../components/IndeterminateProgress'
import PlaylistView from './PlaylistView'
import element from 'vdux/element'
import fire from 'vdux-fire'

function render ({props}) {
	const {playlist, playlistID, uid} = props

	if (playlist.loading) {
		return <IndeterminateProgress/>
	}

	return (
		<PlaylistView playlist={playlist.value} activeKey={playlistID} mine={uid === playlist.value.creatorID}/>
	)
}

export default fire((props) => ({
	playlist: `/playlists/${props.playlistID}`
}))({
	render
})
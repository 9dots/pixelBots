import ChallengeFeed from './ChallengeFeed'
import element from 'vdux/element'

function render ({props}) {
	const {inProgress} = props
	return (
		<ChallengeFeed games={inProgress}/>
	)
}

export default {
	render
}
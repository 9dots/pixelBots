import IndeterminateProgress from '../components/IndeterminateProgress'
import ChallengeFeed from './ChallengeFeed'
import element from 'vdux/element'
import {Block} from 'vdux-ui'
import fire from 'vdux-fire'

function render ({props}) {
	const {games} = props
	if (games.loading) {
		return <IndeterminateProgress/>
	}

	console.log(games.value)
	return (
		<ChallengeFeed {...props} games={games.value}/>
	)
}

export default fire((props) => ({
  ...props.fbProps
}))({
	render
})
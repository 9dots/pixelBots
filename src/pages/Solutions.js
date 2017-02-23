import Loading from '../components/Loading'
import element from 'vdux/element'
import CardFeed from './CardFeed'
import fire from 'vdux-fire'
import {Block} from 'vdux-ui'
import map from '@f/map'

function render ({props}) {
	const {solutions = {}} = props
	if (solutions.loading) return <Loading/>
	return solutions.value
		?	<CardFeed
				w='400px'
				imageSize='400px'
				items={map((s, key) => ({...s, gameRef: key}), solutions.value)}/>
		: <Block mt='10px'> No Solutions Yet </Block>
}

export default fire((props) => ({
	solutions: `/solutions/${props.gameRef}`
}))({
	render
})
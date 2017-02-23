import {setUrl} from 'redux-effects-location'
import Loading from '../components/Loading'
import LeftNav from '../layouts/LeftNav'
import Challenges from './Challenges'
import element from 'vdux/element'
import CardFeed from './CardFeed'
import enroute from 'enroute'

const router = enroute({
	'inProgress': (params, props) => (
		<Challenges items={props.profile.inProgress}/>
	),
	'completed': (params, props) => (
		<Challenges items={props.profile.completed}/>
	)
})

function * onCreate ({props}) {
	const {category, username, params, mine} = props
	if (!mine) {
		return yield setUrl(`/${username}`)
	}
	if (!category) {
		return yield setUrl(`/${username}/${params}/inProgress`)
	}
}

function render ({props}) {
	const {category, username, params} = props
	if (!category) {
		return <Loading/>
	}
	return (
		<LeftNav
			active={category}
			onClick={(key) => setUrl(`/${username}/${props.params}/${key}`)}
			navItems={['In Progress', 'Completed']}>
			{router(category, props)}
		</LeftNav>
	)
}

export default {
	onCreate,
	render
}
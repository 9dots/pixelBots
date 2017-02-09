import {setUrl} from 'redux-effects-location'
import Loading from '../components/Loading'
import LeftNav from '../layouts/LeftNav'
import InProgress from './InProgress'
import element from 'vdux/element'
import enroute from 'enroute'

const router = enroute({
	'in progress': (params, props) => (<InProgress inProgress={props.profile.inProgress}/>)
})

function * onCreate ({props}) {
	const {category, username, params} = props
	if (!category) {
		yield setUrl(`/${username}/${params}/In Progress`)
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
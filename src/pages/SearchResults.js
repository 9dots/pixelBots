import IndeterminateProgress from '../components/IndeterminateProgress'
import ChallengeFeed from './ChallengeFeed'
import PlaylistSearchFeed from './PlaylistSearchFeed'
import element from 'vdux/element'
import reduce from '@f/reduce'
import {Block, Flex} from 'vdux-ui'
import ProfileTab from '../components/ProfileTab'
import {setUrl} from 'redux-effects-location'
import enroute from 'enroute'
import fire from 'vdux-fire'

const router = enroute({
	'games': (params, props) => (
		<ChallengeFeed games={props}/>
	),
	'playlists': (params, props) => (
		<PlaylistSearchFeed playlists={props}/>
	)
})

function render ({props}) {
	const {responses, tab, searchQ = ''} = props
	const hits = responses.value
		? responses.value.hits
		: {}

	const byType = reduce((cur, next) => {
		cur[next._type] && cur[next._type].length > 0
			? cur[next._type] = cur[next._type].concat([next._source])
			: cur[next._type] = [next._source]
		return cur
	},
	{games: [], playlists: [], users: []},
	hits)

	return (
		<Block>
			<Flex borderBottom='1px solid #999' wide relative bottom='0' color='lightBlue' h='42px'>
				<ProfileTab
					title={`${byType.games.length || 0} challenges`}
					underlineColor='red'
					active={tab === 'games'}
					handleClick={() => setUrl(`/search/games/${searchQ}`)}/>
				<ProfileTab
					title={`${byType.playlists.length || 0} playlists`}
					underlineColor='lightBlue'
					active={tab === 'playlists'}
					handleClick={() => setUrl(`/search/playlists/${searchQ}`)}/>
				<ProfileTab
					title={`${byType.users.length || 0} users`}
					active={tab === 'users'}
					underlineColor='yellow'
					handleClick={() => setUrl(`/search/users/${searchQ}`)}/>
			</Flex>
			{responses.loading && props.searchKey
				? <IndeterminateProgress/>
				: router(tab, byType[tab])
			}
		</Block>
	)
}

export default fire((props) => ({
	responses: `/search/response/${props.searchKey}`
}))({
	render
})
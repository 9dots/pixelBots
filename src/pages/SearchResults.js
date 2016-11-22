import IndeterminateProgress from '../components/IndeterminateProgress'
import ChallengeFeed from './ChallengeFeed'
import element from 'vdux/element'
import reduce from '@f/reduce'
import {Block, Flex} from 'vdux-ui'
import Tab from '../components/Tab'
import {setUrl} from 'redux-effects-location'
import enroute from 'enroute'
import fire from 'vdux-fire'

const router = enroute({
	'games': (params, props) => {
		return <ChallengeFeed games={props}/>
	}
})

function render ({props}) {
	const {responses, tab} = props

	if (responses.loading) {
		return <IndeterminateProgress/>
	}

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
				<Tab
					name={`${byType.games.length || 0} challenges`}
					fs='s'
					relative
					bgColor='#f5f5f5'
					lineHeight='2.6em'
					active={tab === 'games'}
					fontWeight='800'
					highlight='false'
					color={tab === 'games' ? '#333' : '#666'}
					hoverProps={tab !== 'games' && {color: '#666'}}
					p='0'
					handleClick={() => setUrl(`/search/games`)}>
					{tab === 'games' && <Block absolute bgColor='red' wide  bottom='-1px' h='6px'/>}
				</Tab>
				<Tab
					name={`${byType.playlists.length || 0} playlists`}
					fs='s'
					relative
					bgColor='#f5f5f5'
					lineHeight='2.6em'
					active={tab === 'playlists'}
					fontWeight='800'
					highlight='false'
					color={tab === 'playlists' ? '#333' : '#666'}
					hoverProps={tab !== 'playlists' && {color: '#666'}}
					p='0'
					handleClick={() => setUrl(`/search/playlists`)}>
					{tab === 'playlists' && <Block absolute bgColor='lightBlue' wide  bottom='-1px' h='6px'/>}
				</Tab>
				<Tab
					name={`${byType.users.length || 0} users`}
					fs='s'
					relative
					bgColor='#f5f5f5'
					lineHeight='2.6em'
					active={tab === 'users'}
					fontWeight='800'
					highlight='false'
					color={tab === 'users' ? '#333' : '#666'}
					hoverProps={tab !== 'users' && {color: '#666'}}
					p='0'
					handleClick={() => setUrl(`/search/users`)}>
					{tab === 'users' && <Block absolute bgColor='yellow' wide  bottom='-1px' h='6px'/>}
				</Tab>
			</Flex>
			{router(tab, byType[tab])}
		</Block>
	)
}

export default fire((props) => ({
	responses: `/search/response/${props.searchKey}`
}))({
	render
})
/**
 * Imports
 */

import PlaylistSearchFeed from 'components/PlaylistSearchFeed'
import ChallengeFeed from 'components/ChallengeFeed'
import Loading from 'components/Loading'
import {component, element} from 'vdux'
import {Block, Flex} from 'vdux-ui'
import Tab from 'components/Tab'
import reduce from '@f/reduce'
import filter from '@f/filter'
import enroute from 'enroute'
import fire from 'vdux-fire'

const router = enroute({
  'games': (params, {items}) => (
    <ChallengeFeed games={items} />
  ),
  'playlists': (params, {items}) => (
    <PlaylistSearchFeed playlists={items} />
  )
})

const reduceType = (cur, next) => {
  return {
    ...cur,
    [next._type]: {
      ...cur[next._type],
      [next._id]: {
        ...next._source.body,
        ref: next._id
      }
    }
  }
}

/**
 * <Search Results/>
 */

export default fire((props) => ({
  responses: `/search/response/${props.searchKey}`
}))(component({
  render ({props, context}) {
	  const {responses, tab, playlists, searchQ = ''} = props
	  const {uid} = context

	  if (responses.loading) return <Loading />

	  const hits = responses.value
	    ? responses.value.hits
	    : {}
	  const byType = reduce(reduceType, {games: {}, playlists: {}, users: {}}, hits)

	  const tabs = <Flex borderBottom='1px solid #e0e0e0' wide relative bottom='0' color='lightBlue' h='42px'>
	    <Tab
	      label={`${Object.keys(byType.games).length || 0} challenges`}
	      underlineColor='red'
	      active={tab === 'games'}
	      handleClick={context.setUrl(`/search/games/${searchQ}`)} />
	    <Tab
	      label={`${Object.keys(byType.playlists).length || 0} playlists`}
	      underlineColor='lightBlue'
	      active={tab === 'playlists'}
	      handleClick={context.setUrl(`/search/playlists/${searchQ}`)} />
	  </Flex>

	  return (
	    <Block mx='20px' >
	    	{tabs}
	      {
	      	responses.loading && props.searchKey
		        ? <Loading />
		        : router(tab, {items: byType[tab]})
		    }
	    </Block>
	  )
  }
}))

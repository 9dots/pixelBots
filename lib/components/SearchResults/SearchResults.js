/**
 * Imports
 */

import PlaylistFeed from 'components/PlaylistFeed'
import ChallengeFeed from 'components/ChallengeFeed'
import EmptyState from 'components/EmptyState'
import UserFeed from 'components/UserFeed'
import Loading from 'components/Loading'
import {component, element} from 'vdux'
import {Block, Flex} from 'vdux-ui'
import Tab from 'components/Tab'
import reduce from '@f/reduce'
import enroute from 'enroute'
import fire from 'vdux-fire'

const router = enroute({
  'games': (params, {items}) => (
    <ChallengeFeed search games={items} />
  ),
  'playlists': (params, {items}) => (
    <PlaylistFeed shouldSort={false} hideProgress playlists={items} />
  ),
  'users': (params, {items}) => (
    <UserFeed users={items} />
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
    const {responses, tab, playlists, searchQ = '', searchKey} = props
    const {uid} = context
    const {loading, value} = responses

    if (loading) return <Loading />

    const hits = value ? value.hits : {}
    const byType = reduce(reduceType, {games: {}, playlists: {}, users: {}}, hits)

    if (!searchQ) {
      return <EmptyState
        title='Find New Challenges'
        icon='search'
        description={'Search to find new challenges and playlists. ' +
        'Discover new and exciting ways to use PixelBots!'} />
    }

    const items = byType[tab]

    return (
      <Block>
        <Tabs tab={tab} byType={byType} searchQ={searchQ} />
        {
          loading && searchKey
            ? <Loading />
            : Object.keys(items).length
              ? <Block p='l' maxWidth={980} mx='auto'>
                {router(tab, {items})}
              </Block>
              : <EmptyState icon='search' description={`We couldn't find any ${tab === 'games' ?  'challenges' : tab} for your search "${searchQ}".  Try simplifying your query or try looking for something different.`} />
      }
      </Block>
    )
  }
}))

const Tabs = component({
  render ({props, context}) {
    const {byType, searchQ, tab} = props

    return (
      <Flex borderBottom='1px solid #e0e0e0' wide relative bottom='0' color='lightBlue' h='52px' align='center' bgColor='#FFF'>
        <Tab
          label={`${Object.keys(byType.playlists).length || 0} playlists`}
          underlineColor='lightBlue'
          active={tab === 'playlists'}
          handleClick={context.setUrl(`/search/playlists/${searchQ}`)} />
        <Tab
          label={`${Object.keys(byType.users).length || 0} users`}
          underlineColor='green'
          active={tab === 'users'}
          handleClick={context.setUrl(`/search/users/${searchQ}`)} />
      </Flex>
    )
  }
})

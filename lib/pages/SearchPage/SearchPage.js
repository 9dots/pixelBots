/**
 * Imports
 */

import IndeterminateProgress from 'components/IndeterminateProgress'
import SearchResults from 'components/SearchResults'
import PixelGradient from 'components/PixelGradient'
import {component, element, decodeValue} from 'vdux'
import {Input} from 'vdux-containers'
import {Block} from 'vdux-ui'

const inputProps = {
  h: '42px',
  textIndent: '8px',
  borderRadius: '2px',
  border: '1px solid divider'
}

export default component({
	* onCreate ({props, context, actions}) {
	  if (!props.searchType) {
	    yield context.setUrl('/search/games')
	  }
	  if (props.searchQ) {
	    const {searchQ, searchType} = props
	    yield actions.newSearch(searchQ, searchType)
	  }
	},
	* onUpdate (prev, {props, actions}) {
	  if (!props.searchType) {
	    yield setUrl('/search/games')
	  }
	  if (props.searchQ && (props.searchQ !== prev.props.searchQ)) {
	    const {searchQ, searchType} = props
	    yield actions.newSearch(searchQ, searchType)
	  }
	},
	initialState ({props}) {
		return {
			searchKey: '',
  		searchValue: props.searchQ || ''
		}
	},
  render ({props, state, actions, context}) {
	  const {searchKey, searchValue} = state
	  const {searchType = 'games', searchQ = ''} = props
	  const {uid} = context

	  return (
	    <Block>
		    <PixelGradient h={250} mb='s'>
		    	<Block 
		    		fontFamily='"Press Start 2P"' fs='m' mb mr={-7}>Search PixelBots:</Block>
		    	<Input
		        onKeyUp={{enter: decodeValue(actions.newSearch)}}
		        value={searchValue}
		    		color='primary'
		        autofocus
		        placeholder='Search…'
		        w={320}
		        inputProps={{
		        	borderRadius: 999,
		        	border: '1px solid divider',
		        	fs: 'm',
		        	px: 20,
		        	py: 8
		        }} />
		    </PixelGradient>
		    <Block pb='xl'>
		      <SearchResults tab={searchType} searchKey={searchKey} searchQ={searchQ} />
		    </Block>
		  </Block>
	  )
  },
  controller: {
  	* newSearch ({context, state, actions, props}, query) {
  		const q = `*${query}*`
		  if (q !== state.prev) {
		  	const {key} = yield context.firebasePush('/search/request', {
		  		index: 'firebase',
          type: ['games', 'playlists'],
          from: 0,
          size: 200,
          q: query
		  	})
		    yield actions.newSearchKey({key, term: query})
		    yield context.setUrl(`/search/${props.searchType}/${query}`)
		  }
  	}
  },
  reducer: {
  	newSearchKey: (state, {term, key}) => ({
  		searchKey: key,
  		searchValue: term,
  		prev: state.searchValue
  	})
  }
})

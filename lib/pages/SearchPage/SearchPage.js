/**
 * Imports
 */

import IndeterminateProgress from 'components/IndeterminateProgress'
import SearchResults from 'components/SearchResults'
import {component, element, decodeValue} from 'vdux'
import {Input} from 'vdux-containers'
import {Block} from 'vdux-ui'

const inputProps = {
  h: '42px',
  textIndent: '8px',
  borderRadius: '2px',
  border: '2px solid #ccc'
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

	  const searchResults = <Block>
	    <Block p='20px' pb='0' align='center center'>
	      <Input
	        wide
	        autofocus
	        inputProps={inputProps}
	        value={searchValue}
	        onKeyUp={{enter: decodeValue(actions.newSearch)}}
	        placeholder='Search Pixelbots' />
	    </Block>
	    <Block>
	      <SearchResults tab={searchType} searchKey={searchKey} searchQ={searchQ} />
	    </Block>
	  </Block>

	  const searchInput = <Block absolute tall top='0' left='0' wide align='center center'>
	    <Input
	      w='90%'
	      autofocus
	      fs='xxl'
	      bgColor='transparent'
	      inputProps={{
	        h: '100px',
	        textIndent: '8px',
	        border: 'none',
	        borderWidth: '0',
	        borderBottom: '3px solid #b5b5b5',
	        bgColor: 'transparent'
	      }}
	      value={searchValue}
	      onKeyUp={{enter: decodeValue(actions.newSearch)}}
	      placeholder='Search Pixelbots'/>
	  </Block>

	  return (
	    <Block wide tall>
	      {
	        searchValue
	          ? searchResults
	          : searchInput
	      }
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
          from: '0',
          size: '50',
          q
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

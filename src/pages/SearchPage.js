import element from 'vdux/element'
import {Block, Flex, Text} from 'vdux-ui'
import {Input} from 'vdux-containers'
import createAction from '@f/create-action'
import Tab from '../components/Tab'
import SearchResults from './SearchResults'
import {setUrl} from 'redux-effects-location'
import {refMethod} from 'vdux-fire'

const newSearchKey = createAction('<SearchPage/>: newSearchKey')
const newSearchQ = createAction('<SearchPage/>: newSearchQ')

const initialState = ({local}) => ({
	searchKey: '',
	searchTerm: '',
	actions: {
		newSearchKey: local((val) => newSearchKey(val)),
		newSearchQ: local((val) => newSearchQ(val))
	}
})

function render ({props, state, local}) {
	const {searchKey, searchTerm, actions} = state
	const {searchType = 'games'} = props

	return (
		<Block>
			<Block align='center center'>
				<Input wide placeholder='Search Pixelbots' onKeyUp={{enter: (e) => newSearch(`*${e.target.value}*`)}}/>
			</Block>
			<Block>
				<SearchResults tab={searchType} searchKey={searchKey}/>
			</Block>
		</Block>
	)

	function * newSearch (query) {
		if (query !== searchTerm) {
			const {key} = yield refMethod({
				ref: `/search/request`,
				updates: {
					method: 'push',
					value: {
						index: 'firebase',
		      	type: ['games', 'users', 'playlists'],
		      	query: query
					}
				}
			})
			yield actions.newSearchQ(query)
			yield actions.newSearchKey(key)
		}
	}
}

function reducer (state, action) {
	switch (action.type) {
		case newSearchKey.type:
			return {
				...state,
				searchKey: action.payload
			}
		case newSearchQ.type:
			return {
				...state,
				searchTerm: action.payload
			}
	}
}

export default {
	initialState,
	reducer,
	render
}
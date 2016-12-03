import IndeterminateProgress from '../components/IndeterminateProgress'
import element from 'vdux/element'
import {Block, Flex, Text} from 'vdux-ui'
import {Input} from 'vdux-containers'
import createAction from '@f/create-action'
import Tab from '../components/Tab'
import SearchResults from './SearchResults'
import {setUrl, getUrl} from 'redux-effects-location'
import {refMethod} from 'vdux-fire'

const newSearchKey = createAction('<SearchPage/>: newSearchKey')

const inputProps = {
  h: '42px',
  textIndent: '8px',
  borderRadius: '2px',
  border: '2px solid #ccc'
}

function * onCreate ({props, state}) {
	if (!props.searchType) {
		yield setUrl('/search/games')
	}
	if (props.searchQ) {
		const {searchQ, searchType} = props
		const {newSearchKey} = state.actions
		yield newSearch(searchQ, searchType, newSearchKey)
	}
}

function * onUpdate (prev, {props, state}) {
	if (!props.searchType) {
		yield setUrl('/search/games')
	}
	if (props.searchQ && (props.searchQ !== prev.props.searchQ)) {
		const {searchQ, searchType} = props
		const {newSearchKey} = state.actions
		yield newSearch(searchQ, searchType, newSearchKey)
	}
}

const initialState = ({local, props}) => ({
	searchKey: '',
	searchValue: props.searchQ || '',
	actions: {
		newSearchKey: local((val) => newSearchKey(val))
	}
})

function render ({props, state, local}) {
	const {searchKey, actions, searchValue} = state
	const {uid, searchType = 'games', searchQ = ''} = props
	const {newSearchKey} = actions

	if (!uid) {
		return <IndeterminateProgress/>
	}

	return (
		<Block wide tall>
			{
				searchValue
					? <Block>
							<Block align='center center'>
								<Input
									wide
									autofocus
									inputProps={inputProps}
									value={searchValue}
									placeholder='Search Pixelbots'
									onKeyUp={{enter: (e) => e.target.value !== searchQ && setUrl(`/search/${searchType}/${e.target.value}`)}}/>
							</Block>
							<Block>
								<SearchResults uid={uid} tab={searchType} searchKey={searchKey} searchQ={searchQ}/>
							</Block>
						</Block>
					: <Block absolute tall top='0' left='0' wide align='center center'>
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
									placeholder='Search Pixelbots'
									onKeyUp={{enter: (e) => e.target.value !== searchQ && setUrl(`/search/${searchType}/${e.target.value}`)}}/>
						</Block>
			}
		</Block>
	)
}

function * newSearch (query, searchType, action, prev = '') {
	const q = `*${query}*`
	if (q !== prev) {
		const {key} = yield refMethod({
			ref: `/search/request`,
			updates: {
				method: 'push',
				value: {
					index: 'firebase',
	      	type: ['games', 'users', 'playlists'],
	      	query: q
				}
			}
		})
		yield action({key, term: query})
	}
}

function reducer (state, action) {
	switch (action.type) {
		case newSearchKey.type:
			const {term, key} = action.payload
			return {
				...state,
				searchKey: key,
				searchValue: term
			}
	}
}

function getProps (props, context) {
	return {
		...props,
		uid: context.currentUser.uid
	}
}

export default {
	onCreate,
	onUpdate,
	getProps,
	initialState,
	reducer,
	render
}
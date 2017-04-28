/**
 * Imports
 */

import ChallengeLoader from 'components/ChallengeLoader'
import VirtualList from 'components/VirtualList'
import {component, element, Window} from 'vdux'
import SortHeader from 'components/SortHeader'
import LinkModal from 'components/LinkModal'
import {Block, Flex, Menu} from 'vdux-ui'
import Button from 'components/Button'
import flatten from 'lodash/flatten'
import {refMethod} from 'vdux-fire'
import objEqual from '@f/equal-obj'
import sort from 'lodash/orderBy'
import chunk from 'lodash/chunk'
import map from '@f/map'

const caseInsensitiveName = (game) => game.name
  ? game.name.toLowerCase()
  : game.title.toLowerCase()

/**
 * <Challenge Feed/>
 */

export default component({
	initialState: {
		orderBy: 'lastEdited',
  	order: 'desc',
  	items: []
	},
	* onCreate ({props, actions, state}) {
		const sortedGames = sort(
			map((game, key) => ({...game, key}), props.games),
			state.orderBy,
			state.order
		)
  	yield actions.setItems(sortedGames)
	},
	* onUpdate (prev, {props, actions, state}) {
		if (prev.state.orderBy !== state.orderBy || prev.state.order !== state.order || !objEqual(prev.props.games, props.games) && props.games) {
	    const sortedGames = sort(
	    	map((game, key) => ({...game, key}), props.games),
	    	state.orderBy,
	    	state.order
	    )
	    yield actions.setItems(sortedGames)
	  }
	},
  render ({props, actions, context, state}) {
	  const {games, mine, search} = props
	  const {uid} = context
	  const {order, orderBy, items} = state

	  const modalFooter = (
	    <Block>
	      <Button ml='m' onClick={context.closeModal()}>Done</Button>
	    </Block>
	  )

	  if (items.length < 1) {
	    return <div/>
	  }

	  const Challenges = ({
	    props
	  }) => (
	    <Block h={props.virtual.style.height} {...props.virtual.style} boxSizing='border-box'>
	      {props.virtual.items.map((game, i) => (
	        <ChallengeLoader
	          checkbox
	          lastEdited={game.lastEdited}
	          setModal={actions.showModal}
	          gameKey={game.key}
	          h={props.itemHeight}
	          remove={actions.remove}
	          key={game.key}
	          draggable={false}
	          uid={uid}
	          mine={mine}
	          ref={game.ref} />
	      ))}
	    </Block>
	  )

	  const CVL = VirtualList(Challenges, items, {
	  	height: 69,
	  	buffer: 40,
	  	container: search ? document.getElementById('top') : document.getElementById('profile-container')
	  })

	  return (
	    <Flex flexWrap='wrap' wide margin='0 auto'>
	      <Menu
	        column
	        wide
	        bgColor='white'
	        minWidth='820px'>
	        <Block pl='5%' pr='16px' py='8px' color='#999' fontWeight='800' align='start center' bgColor='transparent' border='1px solid divider' borderBottomWidth={0}>
	          <SortHeader
	            onClick={actions.handleClick(caseInsensitiveName)}
	            minWidth='250px'
	            flex
	            dir={orderBy === caseInsensitiveName && order}
	            label='NAME' />
	          <SortHeader
	            onClick={actions.handleClick('animal')}
	            dir={orderBy === 'animal' && order}
	            minWidth='180px'
	            w='180px'
	            label='ANIMAL' />
	          <SortHeader
	            onClick={actions.handleClick('inputType')}
	            dir={orderBy === 'inputType' && order}
	            minWidth='180px'
	            w='180px'
	            label='CODE TYPE' />
	          <SortHeader
	            onClick={actions.handleClick('lastEdited')}
	            dir={orderBy === 'lastEdited' && order}
	            minWidth='180px'
	            w='180px'
	            label='LAST EDITED' />
	        </Block>
	        <Block>
	          <CVL />
	        </Block>
	      </Menu>
	    </Flex>
	  )
  },
  controller: {
  	* showModal ({context}, link) {
  		yield context.openModal(
  			<LinkModal
	        code={link}
	        footer={modalFooter} />
	    )
  	},
  	* handleClick ({state, actions}, cat) {
	    if (state.orderBy === cat) {
	      const newOrder = state.order === 'asc' ? 'desc' : 'asc'
	      yield actions.setOrder(newOrder)
	    } else {
	      yield actions.setOrderType(cat)
	    }
  	},
  	* remove ({context}, ref) {
  		const {uid, firebaseSet} = context
  		yield firebaseSet(`/users/${uid}/games/${ref}`, null)
  	}
  },
  reducer: {
  	setOrderType: (state, orderBy) => ({orderBy}),
	  setOrder: (state, order) => ({order}),
	  setItems: (state, items) => ({items})
  }
})

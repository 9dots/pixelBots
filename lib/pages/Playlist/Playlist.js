/**
 * Imports
 */

import {Block, Icon, Text} from 'vdux-ui'
import Loading from 'components/Loading'
// import {immediateSave} from '../middleware/saveCode'
import {component, element} from 'vdux'
import Button from 'components/Button'
import Game from 'pages/Game'
import fire from 'vdux-fire'

/**
 * <Playlist/>
 */

export default fire((props) => ({
  list: `/savedList/${props.ref}`,
  playlist: `/playlists/${props.playlistRef}`
}))(component({
	intitialState: {
		ready: false
	},

  render ({props, state, actions}) {
	  const {list, playlist} = props
	  const {ready, activeList} = state

	  if (!state.ready) return <Loading />

	  const {sequence, current = 0} = activeList

	  return (
	    <View current={current} {...props} listRef={props.ref} {...activeList} next={actions.next} prev={actions.prev} />
	  )
  },

  * onUpdate (prev, {props, state, actions, context}) {
  	const {ref, list, playlist, playlistRef} = props
  	if (!state.ready && !list.loading && !playlist.loading) {
  		const mergeList = {...props.userProfile.lists[playlistRef], ...playlist.value}
  	  const activeList = list.value ? list.value : mergeList
    	const savePath = ref === 'nothing'
  	    ? `/users/${context.uid}/lists/${playlistRef}`
  	    : `/savedList/${ref}`
  		yield actions.setReady({activeList, savePath})
  	}
  	if (state.ready) {
  		const mergeList = {...props.userProfile.lists[playlistRef], ...playlist.value}
  	  const activeList = list.value ? list.value : mergeList
  		if (prev.state.activeList && prev.state.activeList.current !== activeList.current) {
  			const savePath = ref === 'nothing'
  	    ? `/users/${context.uid}/lists/${playlistRef}`
  	    : `/savedList/${ref}`
  			yield actions.setReady({activeList, savePath})
  		}
  	}
  },

  controller: {
  	* next ({context, props, state}) {
  		const {savePath, activeList} = state
  		const {current, sequence} = activeList
			if (current + 1 < sequence.length) {
				yield context.firebaseUpdate(savePath, {lastEdited: Date.now()})
	      yield context.firebaseTransaction(savePath + '/current', (val) => (
	      	val + 1
	      ))
			}
		},
		* prev ({context, props, state}) {
			const {savePath, activeList} = state
  		const {current} = activeList
			// yield immediateSave()
			if (current - 1 >= 0) {
	      yield context.firebaseUpdate(savePath, {lastEdited: Date.now()})
	      yield context.firebaseTransaction(savePath + '/current', (val) => (
	      	val - 1
	      ))
      }
		}
  },

  reducer: {
  	setReady: (state, {activeList, savePath}) => ({ready: true, activeList, savePath})
  }
}))

/** @jsx element */

const View = component({
	render ({props}) {
		const isNext = props.current + 1 < props.sequence.length
	  const isPrev = props.current - 1 >= 0

	  const completed = props.completed
	    ? props.completed[props.sequence[props.current]]
	    : false

	  const titleActions = (
	    <Block>
	      <Text fs='m'>{props.current + 1} / {props.sequence.length}</Text>
	      <Button
	        ml='2em'
	        mr='0.5em'
	        bgColor={isPrev ? 'blue' : 'disabled'}
	        disabled={!isPrev}
	        onClick={props.prev}>BACK</Button>
	      <Button
	        bgColor={isNext ? 'blue' : 'disabled'}
	        disabled={!isNext}
	        onClick={props.next}>NEXT</Button>
	    </Block>
	  )

	  const leftAction = isPrev &&
	    <Button
	      px='0'
	      w='40px'
	      align='center center'
	      borderWidth='0'
	      bgColor='transparent'
	      hoverProps={{bgColor: '#ccc'}}
	      mr='1em'
	      color='#333'
	      onClick={props.prev}>
	      <Icon name='arrow_back' />
	    </Button>

	  const playlistLayout = {
			leftAction,
      title: props.name,
      img: props.imageUrl,
      actions: titleActions
	  }

	  return (
	  	<Game
		    {...props}
		    key={`playlist-game-holder-${props.sequence[props.current]}`}
		    playlist={playlistLayout}
		    completed={completed}
		    gameRef={props.sequence[props.current]} />
	  )
	}
})

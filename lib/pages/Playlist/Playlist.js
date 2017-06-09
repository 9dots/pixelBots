/**
 * Imports
 */

import GameLoader from 'components/GameLoader'
import LinkModal from 'components/LinkModal'
import {Block, Icon, Text} from 'vdux-ui'
import Loading from 'components/Loading'
import Results from 'components/Results'
import {component, element} from 'vdux'
import Button from 'components/Button'
import mapValues from '@f/map-values'
import enroute from 'enroute'
import fire from 'vdux-fire'


const router = enroute({
	results: (params, props) => <Results {...params} {...props} />,
  default: (params, props) => <GameLoader {...params} {...props} />
})

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

	  const {sequence} = activeList

	  return (
	    <View {...props} listRef={props.ref} {...activeList} current={props.current}  next={actions.next} prev={actions.prev} />
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
  		yield context.firebaseUpdate(state.savePath, {lastEdited: Date.now()})
	    yield context.firebaseTransaction(state.savePath + '/current', (val) => (
	    	parseInt(props.current, 10)
	    ))
  	}
  },

  controller: {
  	* next ({context, props, state}) {
  		const {savePath, activeList} = state
  		const {sequence, playlistKey} = activeList
      const {username} = context
      const cur = parseInt(props.current, 10)

			if (cur + 1 < sequence.length) {
	      yield context.setUrl(`/playlist/${playlistKey}/${cur + 1}`)
			} else {
        yield context.setUrl('/')
      }
		},
		* prev ({context, props, state}) {
			const {savePath, activeList} = state
  		const {playlistKey} = activeList

			// yield immediateSave()
			const cur = parseInt(props.current, 10)

			if (cur - 1 >= 0) {
	      yield context.setUrl(`/playlist/${playlistKey}/${cur - 1}`)
      }
		}
  },

  reducer: {
  	setReady: (state, {activeList, savePath}) => ({ready: true, activeList, savePath})
  }
}))

/** @jsx element */

const View = fire((props) => ({
  game: `/games/${props.sequence[props.current]}[once]`,
}))(component({
	render ({props, actions, context}) {
		const {sequence, game} = props
		const current = parseInt(props.current, 10)
		const isNext = current + 1 < sequence.length
	  const isPrev = current - 1 >= 0

	  const completed = props.completed
	    ? completed[sequence[current]]
	    : false

	  const {loading, value} = game
	  if(loading) return <span />

   	const modalFooter = (
		  <Block>
		    <Button ml='m' onClick={context.closeModal()}>Done</Button>
		  </Block>
		)

	  const titleActions = (
	    <Block align='start center'>
	      <Text fs='m'>{current + 1} / {sequence.length}</Text>
	      <Button
	        ml='2em'
	        mr='0.5em'
	        h={38}
	        bgColor={isPrev ? 'blue' : 'disabled'}
	        disabled={!isPrev}
	        onClick={props.prev}>BACK</Button>
	      <Button
	      	mr='0.5em'
	      	h={38}
	        bgColor={isNext ? 'blue' : 'disabled'}
	        disabled={!isNext}
	        onClick={props.next}>NEXT</Button>
       	<Button
	        onClick={context.openModal(
	        	() => <LinkModal code={value.shortLink} footer={modalFooter} />
	        )}
	        h={38}
	        px='s'
	        borderColor='divider'
	        color='primary'
	        align='space-between'
	        bgColor='white'>
	        <Icon name='link' />
	      </Button>
	    </Block>
	  )

	  const playlistLayout = {
      title: props.name,
      img: props.imageUrl,
      subtitle: value.title,
      actions: titleActions
	  }

	  return (
  		router(props.subpage || 'default', {
  			...props, 
  			key: `playlist-game-holder-${sequence[current]}`,
  			playlist: playlistLayout,
  			onGameComplete: actions.onGameComplete,
  			gameRef: sequence[current],
  			completed
  		})
	  )
	},

  controller: {
    * onGameComplete ({props, context}) {
      const completed = mapValues((c, key) => key, props.userProfile.completedByGame)
      const {sequence} = props
      const {uid} = context

      yield context.setUrl(`${context.url}/results`)

      if (sequence.filter(s => completed.indexOf(s) !== -1).length === sequence.length) {
        yield context.firebaseUpdate(`/users/${uid}/completedLists`, {
          [props.playlistRef]: {
            type: 'playlist',
            lastEdited: Date.now()
          }
        })
        yield context.firebaseUpdate(`/users/${uid}/lists`, {
          [props.playlistRef]: null
        })
      }
    }
  }
}))
